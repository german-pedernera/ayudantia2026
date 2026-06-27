import { useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

/**
 * Genera la fecha completa del cumpleaños en el año actual.
 * Ejemplo: si la persona nació el 01/01/1991, devuelve "1 de enero del 2026"
 */
const generarFechaCumpleanos = (fechaNacimiento) => {
  if (!fechaNacimiento) return '';
  const nacimiento = dayjs(fechaNacimiento);
  const hoy = dayjs();
  // Construir la fecha del cumpleaños en el año actual
  let cumple = hoy.year(hoy.year()).month(nacimiento.month()).date(nacimiento.date());
  // Si ya pasó este año, usar el próximo
  if (cumple.isBefore(hoy, 'day')) {
    cumple = cumple.add(1, 'year');
  }
  cumple = cumple.locale('es');
  // Formato: "26 de junio del 2026"
  return `${cumple.date()} de ${cumple.format('MMMM')} del ${cumple.year()}`;
};

/**
 * Componente invisible que renderiza la tarjeta de cumpleaños y la descarga como imagen.
 */
const BirthdayCardDownloader = ({ persona, onDownloadStart, onDownloadEnd }) => {
  const cardRef = useRef(null);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    if (onDownloadStart) onDownloadStart();

    try {
      // Hacer visible temporalmente para capturar
      const container = cardRef.current;
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.display = 'block';
      container.style.zIndex = '-1';

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        width: 800,
        height: 500,
      });

      container.style.display = 'none';

      // Descargar
      const link = document.createElement('a');
      link.download = `Tarjeta_Cumpleanos_${persona.nombreCompleto.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Error generando tarjeta:', err);
    } finally {
      if (onDownloadEnd) onDownloadEnd();
    }
  }, [persona, onDownloadStart, onDownloadEnd]);

  const fechaCompleta = generarFechaCumpleanos(persona.fechaNacimiento);

  return (
    <>
      {/* Tarjeta oculta para captura */}
      <div
        ref={cardRef}
        style={{
          display: 'none',
          width: '800px',
          height: '500px',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: '"Segoe UI", "Inter", Arial, sans-serif',
        }}
      >
        {/* Fondo de la tarjeta */}
        <img
          src="/birthday_card_bg.png"
          alt=""
          crossOrigin="anonymous"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Overlay semitransparente para legibilidad */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '620px',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.85)',
            borderRadius: '20px',
            padding: '40px 30px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(4px)',
          }}
        >
          {/* Título */}
          <div
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#e65100',
              marginBottom: '6px',
              letterSpacing: '3px',
              textTransform: 'uppercase',
            }}
          >
            ¡Feliz Cumpleaños!
          </div>

          {/* Emoji decorativo */}
          <div style={{ fontSize: '38px', marginBottom: '8px' }}>
            🎂🎉🎈
          </div>

          {/* Nombre */}
          <div
            style={{
              fontSize: '32px',
              fontWeight: '800',
              color: '#1a237e',
              marginBottom: '12px',
              lineHeight: '1.2',
              wordBreak: 'break-word',
            }}
          >
            {persona.nombreCompleto}
          </div>

          {/* Fecha */}
          <div
            style={{
              fontSize: '18px',
              fontWeight: '500',
              color: '#424242',
              marginBottom: '16px',
            }}
          >
            {fechaCompleta}
          </div>

          {/* Línea decorativa */}
          <div
            style={{
              width: '80px',
              height: '3px',
              background: 'linear-gradient(90deg, #e65100, #ff9800, #e65100)',
              margin: '0 auto 16px',
              borderRadius: '2px',
            }}
          />

          {/* Mensaje */}
          <div
            style={{
              fontSize: '15px',
              fontWeight: '400',
              color: '#616161',
              fontStyle: 'italic',
              lineHeight: '1.5',
            }}
          >
            Con los mejores deseos en este día tan especial.
            <br />
            ¡Que se cumplan todos tus sueños!
          </div>
        </div>
      </div>

      {/* Exponer la función de descarga */}
      <button
        onClick={handleDownload}
        style={{ display: 'none' }}
        data-download-trigger
      />
    </>
  );
};

export { BirthdayCardDownloader, generarFechaCumpleanos };
export default BirthdayCardDownloader;
