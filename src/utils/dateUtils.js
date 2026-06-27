import dayjs from 'dayjs';

/**
 * Calcula la edad actual basada en la fecha de nacimiento.
 */
export const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return 0;
  const nacimiento = dayjs(fechaNacimiento);
  const hoy = dayjs();
  let edad = hoy.year() - nacimiento.year();
  const mesActual = hoy.month();
  const mesNacimiento = nacimiento.month();

  if (mesActual < mesNacimiento || (mesActual === mesNacimiento && hoy.date() < nacimiento.date())) {
    edad--;
  }

  return edad;
};

/**
 * Calcula la edad que cumplirá en una fecha específica.
 */
export const calcularEdadEnFecha = (fechaNacimiento, fechaObjetivo) => {
  if (!fechaNacimiento) return 0;
  const nacimiento = dayjs(fechaNacimiento);
  const objetivo = dayjs(fechaObjetivo);
  return objetivo.year() - nacimiento.year();
};

/**
 * Calcula los años de una institución.
 */
export const calcularAniosInstitucion = (fechaCreacion) => {
  if (!fechaCreacion) return 0;
  const creacion = dayjs(fechaCreacion);
  const hoy = dayjs();
  let anios = hoy.year() - creacion.year();
  const mesActual = hoy.month();
  const mesCreacion = creacion.month();

  if (mesActual < mesCreacion || (mesActual === mesCreacion && hoy.date() < creacion.date())) {
    anios--;
  }

  return anios;
};

/**
 * Formatea fecha a dd/mm/yyyy.
 */
export const formatearFecha = (fecha) => {
  if (!fecha) return '';
  return dayjs(fecha).format('DD/MM/YYYY');
};

/**
 * Verifica si una fecha (mes/día) cae dentro de los próximos N días.
 */
export const esAniversarioProximo = (fecha, dias = 7) => {
  if (!fecha) return false;
  const hoy = dayjs().startOf('day');
  const fechaOriginal = dayjs(fecha);

  // Crear la fecha de aniversario este año
  let aniversario = dayjs()
    .year(hoy.year())
    .month(fechaOriginal.month())
    .date(fechaOriginal.date())
    .startOf('day');

  // Si el aniversario ya pasó este año, usar el del próximo año
  if (aniversario.isBefore(hoy)) {
    aniversario = aniversario.add(1, 'year');
  }

  const diff = aniversario.diff(hoy, 'day');
  return diff >= 0 && diff <= dias;
};

/**
 * Obtiene los días restantes hasta el próximo aniversario.
 */
export const diasHastaAniversario = (fecha) => {
  if (!fecha) return Infinity;
  const hoy = dayjs().startOf('day');
  const fechaOriginal = dayjs(fecha);

  let aniversario = dayjs()
    .year(hoy.year())
    .month(fechaOriginal.month())
    .date(fechaOriginal.date())
    .startOf('day');

  if (aniversario.isBefore(hoy)) {
    aniversario = aniversario.add(1, 'year');
  }

  return aniversario.diff(hoy, 'day');
};

/**
 * Obtiene la fecha del próximo aniversario.
 */
export const proximoAniversario = (fecha) => {
  if (!fecha) return null;
  const hoy = dayjs().startOf('day');
  const fechaOriginal = dayjs(fecha);

  let aniversario = dayjs()
    .year(hoy.year())
    .month(fechaOriginal.month())
    .date(fechaOriginal.date())
    .startOf('day');

  if (aniversario.isBefore(hoy)) {
    aniversario = aniversario.add(1, 'year');
  }

  return aniversario;
};

/**
 * Verifica si hoy es el aniversario.
 */
export const esHoy = (fecha) => {
  if (!fecha) return false;
  const hoy = dayjs();
  const f = dayjs(fecha);
  return hoy.month() === f.month() && hoy.date() === f.date();
};

/**
 * Obtiene todos los eventos de un mes para el calendario.
 */
export const obtenerEventosMes = (personas, instituciones, mes, anio) => {
  const eventos = [];

  personas.forEach((p) => {
    const fecha = dayjs(p.fechaNacimiento);
    if (fecha.month() === mes) {
      eventos.push({
        dia: fecha.date(),
        tipo: 'persona',
        nombre: p.nombreCompleto,
        telefono: p.telefono,
        fecha: p.fechaNacimiento,
        edadCumple: anio - fecha.year(),
        id: p.id,
      });
    }
  });

  instituciones.forEach((i) => {
    const fecha = dayjs(i.fechaCreacionInstitucion);
    if (fecha.month() === mes) {
      eventos.push({
        dia: fecha.date(),
        tipo: 'institucion',
        nombre: i.nombreInstitucion,
        telefono: i.telefono,
        fecha: i.fechaCreacionInstitucion,
        aniosCumple: anio - fecha.year(),
        id: i.id,
      });
    }
  });

  return eventos;
};
