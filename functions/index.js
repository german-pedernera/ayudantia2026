const { onSchedule } = require("firebase-functions/v2/scheduler");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp();
const db = admin.firestore();

/**
 * Función programada que se ejecuta todos los días a las 09:00 AM (America/Argentina/Buenos_Aires).
 * Revisa todos los aniversarios y envía notificaciones via Telegram para los que ocurren mañana.
 */
exports.checkAnniversaries = onSchedule(
  {
    schedule: "0 8 * * *",
    timeZone: "America/Argentina/Buenos_Aires",
    retryCount: 3,
  },
  async (event) => {
    logger.info("Iniciando verificación de aniversarios...");

    try {
      // Obtener configuración de Telegram
      const configDoc = await db.collection("configuracion").doc("telegram").get();
      if (!configDoc.exists) {
        logger.warn("No se encontró configuración de Telegram");
        return;
      }

      const { botToken, chatId } = configDoc.data();
      if (!botToken || !chatId) {
        logger.warn("Token o Chat ID de Telegram no configurados");
        return;
      }

      // Calcular la fecha de mañana
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowMonth = tomorrow.getMonth(); // 0-indexed
      const tomorrowDay = tomorrow.getDate();

      const messages = [];

      // Verificar personas
      const personasSnapshot = await db.collection("personas").get();
      personasSnapshot.forEach((doc) => {
        const persona = doc.data();
        if (!persona.fechaNacimiento) return;

        const fechaNac = new Date(persona.fechaNacimiento);
        if (fechaNac.getMonth() === tomorrowMonth && fechaNac.getDate() === tomorrowDay) {
          const edad = tomorrow.getFullYear() - fechaNac.getFullYear();
          const fechaFormateada = `${String(tomorrowDay).padStart(2, "0")}/${String(tomorrowMonth + 1).padStart(2, "0")}/${tomorrow.getFullYear()}`;

          messages.push(
            `🎂 *Recordatorio:*\n\n` +
            `Mañana cumple años *${persona.nombre} ${persona.apellido}*.\n` +
            `📅 Fecha: ${fechaFormateada}\n` +
            `🎉 Edad: ${edad} años.\n\n` +
            `_Sistema de Aniversarios._`
          );
        }
      });

      // Verificar instituciones
      const institucionesSnapshot = await db.collection("instituciones").get();
      institucionesSnapshot.forEach((doc) => {
        const inst = doc.data();
        if (!inst.fechaCreacionInstitucion) return;

        const fechaCreacion = new Date(inst.fechaCreacionInstitucion);
        if (fechaCreacion.getMonth() === tomorrowMonth && fechaCreacion.getDate() === tomorrowDay) {
          const anios = tomorrow.getFullYear() - fechaCreacion.getFullYear();

          messages.push(
            `🏛️ *Recordatorio:*\n\n` +
            `Mañana se celebra el aniversario de *${inst.nombreInstitucion}*.\n` +
            `🎉 Cumple ${anios} años.\n\n` +
            `_Sistema de Aniversarios._`
          );
        }
      });

      // Enviar mensajes a Telegram
      if (messages.length === 0) {
        messages.push(
          `📢 *Reporte Diario:*\n\n` +
          `No hay cumpleaños ni aniversarios de instituciones registrados para mañana.\n\n` +
          `_Sistema de Aniversarios._`
        );
      }

      logger.info(`Enviando ${messages.length} notificación(es) a Telegram`);

      for (const message of messages) {
        try {
          const response = await fetch(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: "Markdown",
              }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            logger.error("Error al enviar mensaje de Telegram:", errorData);
          } else {
            logger.info("Mensaje enviado exitosamente");
          }
        } catch (err) {
          logger.error("Error en la solicitud a Telegram:", err);
        }
      }

      logger.info("Verificación de aniversarios completada");
    } catch (error) {
      logger.error("Error general en checkAnniversaries:", error);
      throw error;
    }
  }
);

/**
 * Función programada que se ejecuta cada minuto.
 * Busca recordatorios no notificados y cuya fecha/hora se haya cumplido para enviar alerta por Telegram.
 */
exports.checkReminders = onSchedule(
  {
    schedule: "* * * * *",
    timeZone: "America/Argentina/Buenos_Aires",
    retryCount: 3,
  },
  async (event) => {
    logger.info("Iniciando verificación de recordatorios...");

    try {
      // Obtener configuración de Telegram
      const configDoc = await db.collection("configuracion").doc("telegram").get();
      if (!configDoc.exists) {
        logger.warn("No se encontró configuración de Telegram");
        return;
      }

      const { botToken, chatId } = configDoc.data();
      if (!botToken || !chatId) {
        logger.warn("Token o Chat ID de Telegram no configurados");
        return;
      }

      const now = new Date();
      const recordatoriosSnapshot = await db
        .collection("recordatorios")
        .where("notificado", "==", false)
        .get();

      if (recordatoriosSnapshot.empty) {
        logger.info("No hay recordatorios pendientes por notificar");
        return;
      }

      const batch = db.batch();
      let sentCount = 0;

      for (const doc of recordatoriosSnapshot.docs) {
        const reminder = doc.data();
        if (!reminder.fechaHora) continue;

        // Si no tiene timezone específico de Argentina, le agregamos el offset.
        let dateStr = reminder.fechaHora;
        if (!dateStr.includes("-03:00") && !dateStr.includes("+") && !dateStr.includes("Z")) {
          dateStr += "-03:00";
        }
        
        const targetDate = new Date(dateStr);
        
        if (targetDate <= now) {
          const message = 
            `🔔 *Recordatorio Pendiente:*\n\n` +
            `📌 *Título:* ${reminder.titulo}\n` +
            `📝 *Anotación:* ${reminder.descripcion || "Sin descripción"}\n` +
            `📅 *Plazo:* ${reminder.fechaHora.replace("T", " ")} hs.\n\n` +
            `_Sistema de Aniversarios._`;

          try {
            const response = await fetch(
              `https://api.telegram.org/bot${botToken}/sendMessage`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  chat_id: chatId,
                  text: message,
                  parse_mode: "Markdown",
                }),
              }
            );

            if (response.ok) {
              logger.info(`Notificación enviada para recordatorio: ${reminder.titulo}`);
              batch.update(doc.ref, { notificado: true });
              sentCount++;
            } else {
              const errorData = await response.json();
              logger.error(`Error al enviar Telegram para doc ${doc.id}:`, errorData);
            }
          } catch (err) {
            logger.error(`Error al disparar Telegram para doc ${doc.id}:`, err);
          }
        }
      }

      if (sentCount > 0) {
        await batch.commit();
        logger.info(`Se procesaron y notificaron ${sentCount} recordatorios.`);
      } else {
        logger.info("Ningún recordatorio cumplió el plazo en esta ejecución.");
      }

    } catch (error) {
      logger.error("Error general en checkReminders:", error);
      throw error;
    }
  }
);

