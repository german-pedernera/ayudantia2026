/**
 * Valida los datos de una persona.
 * Retorna un objeto con los errores encontrados.
 */
export const validarPersona = (data) => {
  const errors = {};

  if (!data.nombreCompleto || !data.nombreCompleto.trim()) {
    errors.nombreCompleto = 'El nombre completo es obligatorio';
  }

  if (!data.fechaNacimiento) {
    errors.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
  }

  return errors;
};

/**
 * Valida los datos de una institución.
 * Retorna un objeto con los errores encontrados.
 */
export const validarInstitucion = (data) => {
  const errors = {};

  if (!data.nombreInstitucion || !data.nombreInstitucion.trim()) {
    errors.nombreInstitucion = 'El nombre de la institución es obligatorio';
  }

  if (!data.fechaCreacionInstitucion) {
    errors.fechaCreacionInstitucion = 'La fecha de creación es obligatoria';
  }

  if (!data.direccion || !data.direccion.trim()) {
    errors.direccion = 'La dirección es obligatoria';
  }

  if (!data.responsable || !data.responsable.trim()) {
    errors.responsable = 'El responsable es obligatorio';
  }

  if (!data.telefono || !data.telefono.trim()) {
    errors.telefono = 'El teléfono es obligatorio';
  }

  return errors;
};

/**
 * Sanitiza un texto eliminando caracteres peligrosos.
 */
export const sanitizar = (texto) => {
  if (!texto) return '';
  return texto
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
};
