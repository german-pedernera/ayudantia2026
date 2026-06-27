import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { formatearFecha, calcularEdad, calcularAniosInstitucion } from './dateUtils';

/**
 * Exporta datos a PDF.
 */
export const exportToPDF = (data, tipo, titulo) => {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(18);
  doc.setTextColor(26, 35, 126);
  doc.text(titulo, 14, 22);

  // Fecha de generación
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-AR')}`, 14, 30);

  let columns = [];
  let rows = [];

  if (tipo === 'personas') {
    columns = ['Jerarquía', 'Nombre Completo', 'Unidad', 'Fecha Nac.', 'Edad', 'Teléfono'];
    rows = data.map((p) => [
      p.jerarquia || '-',
      p.nombreCompleto,
      p.unidad || '-',
      formatearFecha(p.fechaNacimiento),
      calcularEdad(p.fechaNacimiento),
      p.telefono,
    ]);
  } else if (tipo === 'instituciones') {
    columns = ['Institución', 'Fecha Creación', 'Años', 'Dirección', 'Responsable', 'Teléfono'];
    rows = data.map((i) => [
      i.nombreInstitucion,
      formatearFecha(i.fechaCreacionInstitucion),
      calcularAniosInstitucion(i.fechaCreacionInstitucion),
      i.direccion,
      i.responsable,
      i.telefono,
    ]);
  } else if (tipo === 'aniversarios') {
    columns = ['Nombre', 'Tipo', 'Fecha', 'Edad/Años', 'Teléfono'];
    rows = data.map((item) => [
      item.nombre,
      item.tipo === 'persona' ? 'Cumpleaños' : 'Aniversario',
      formatearFecha(item.fecha),
      item.tipo === 'persona' ? item.edadCumple : item.aniosCumple,
      item.telefono || '-',
    ]);
  }

  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: 36,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [26, 35, 126],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [240, 242, 245],
    },
  });

  doc.save(`${titulo.replace(/\s/g, '_')}.pdf`);
};

/**
 * Exporta datos a Excel.
 */
export const exportToExcel = (data, tipo, titulo) => {
  let rows = [];

  if (tipo === 'personas') {
    rows = data.map((p) => ({
      Jerarquía: p.jerarquia || '-',
      'Nombre Completo': p.nombreCompleto,
      'Unidad': p.unidad || '',
      'Fecha Nacimiento': formatearFecha(p.fechaNacimiento),
      Edad: calcularEdad(p.fechaNacimiento),
      Teléfono: p.telefono,
    }));
  } else if (tipo === 'instituciones') {
    rows = data.map((i) => ({
      Institución: i.nombreInstitucion,
      'Fecha Creación': formatearFecha(i.fechaCreacionInstitucion),
      Años: calcularAniosInstitucion(i.fechaCreacionInstitucion),
      Dirección: i.direccion,
      Responsable: i.responsable,
      Teléfono: i.telefono,
      Observaciones: i.observaciones || '',
    }));
  } else if (tipo === 'aniversarios') {
    rows = data.map((item) => ({
      Nombre: item.nombre,
      Tipo: item.tipo === 'persona' ? 'Cumpleaños' : 'Aniversario',
      Fecha: formatearFecha(item.fecha),
      'Edad/Años': item.tipo === 'persona' ? item.edadCumple : item.aniosCumple,
      Teléfono: item.telefono || '',
    }));
  }

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, titulo.substring(0, 31));
  XLSX.writeFile(wb, `${titulo.replace(/\s/g, '_')}.xlsx`);
};
