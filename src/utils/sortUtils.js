import dayjs from 'dayjs';
import { JERARQUIAS } from './constants';

export const sortPersonasDefault = (personas) => {
  return [...personas].sort((a, b) => {
    const getMonth = (dateStr) => {
      if (!dateStr) return 99;
      return dayjs(dateStr).month();
    };
    const getDay = (dateStr) => {
      if (!dateStr) return 99;
      return dayjs(dateStr).date();
    };
    const getJerarquiaIndex = (j) => {
      const idx = JERARQUIAS.indexOf(j);
      return idx === -1 ? 99 : idx;
    };

    const aMonth = getMonth(a.fechaNacimiento);
    const bMonth = getMonth(b.fechaNacimiento);

    if (aMonth !== bMonth) {
      return aMonth - bMonth;
    }

    const aDay = getDay(a.fechaNacimiento);
    const bDay = getDay(b.fechaNacimiento);
    if (aDay !== bDay) {
      return aDay - bDay;
    }

    const aJer = getJerarquiaIndex(a.jerarquia);
    const bJer = getJerarquiaIndex(b.jerarquia);
    if (aJer !== bJer) {
      return aJer - bJer;
    }

    // fallback to nombre Completo
    return (a.nombreCompleto || '').localeCompare(b.nombreCompleto || '');
  });
};
