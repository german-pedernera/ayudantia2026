import { useMemo } from 'react';
import dayjs from 'dayjs';
import { esAniversarioProximo, diasHastaAniversario, proximoAniversario } from '../utils/dateUtils';

export const useAniversarios = (personas, instituciones) => {
  const proximosCumpleanos = useMemo(() => {
    return personas
      .filter((p) => esAniversarioProximo(p.fechaNacimiento, 7))
      .map((p) => {
        const proxFecha = proximoAniversario(p.fechaNacimiento);
        const nacimiento = dayjs(p.fechaNacimiento);
        return {
          id: p.id,
          nombre: p.nombreCompleto,
          telefono: p.telefono,
          fecha: p.fechaNacimiento,
          proximaFecha: proxFecha?.format('DD/MM/YYYY'),
          edadCumple: proxFecha ? proxFecha.year() - nacimiento.year() : 0,
          diasRestantes: diasHastaAniversario(p.fechaNacimiento),
          tipo: 'persona',
        };
      })
      .sort((a, b) => a.diasRestantes - b.diasRestantes);
  }, [personas]);

  const proximosAniversarios = useMemo(() => {
    return instituciones
      .filter((i) => esAniversarioProximo(i.fechaCreacionInstitucion, 7))
      .map((i) => {
        const proxFecha = proximoAniversario(i.fechaCreacionInstitucion);
        const creacion = dayjs(i.fechaCreacionInstitucion);
        return {
          id: i.id,
          nombre: i.nombreInstitucion,
          telefono: i.telefono,
          fecha: i.fechaCreacionInstitucion,
          proximaFecha: proxFecha?.format('DD/MM/YYYY'),
          aniosCumple: proxFecha ? proxFecha.year() - creacion.year() : 0,
          diasRestantes: diasHastaAniversario(i.fechaCreacionInstitucion),
          tipo: 'institucion',
        };
      })
      .sort((a, b) => a.diasRestantes - b.diasRestantes);
  }, [instituciones]);

  const todosProximos = useMemo(() => {
    const todos = [
      ...proximosCumpleanos.map((p) => ({ ...p, tipoLabel: 'Cumpleaños' })),
      ...proximosAniversarios.map((i) => ({ ...i, tipoLabel: 'Aniversario' })),
    ];
    return todos.sort((a, b) => a.diasRestantes - b.diasRestantes);
  }, [proximosCumpleanos, proximosAniversarios]);

  const aniversariosHoy = useMemo(() => {
    return todosProximos.filter((item) => item.diasRestantes === 0);
  }, [todosProximos]);

  const stats = useMemo(() => ({
    totalPersonas: personas.length,
    totalInstituciones: instituciones.length,
    aniversariosSemana: todosProximos.length,
    aniversariosHoy: aniversariosHoy.length,
  }), [personas, instituciones, todosProximos, aniversariosHoy]);

  return {
    proximosCumpleanos,
    proximosAniversarios,
    todosProximos,
    aniversariosHoy,
    stats,
  };
};
