import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  PageOrientation,
  ImageRun,
  Header,
  TabStopPosition,
  TabStopType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  VerticalAlign,
  convertInchesToTwip,
} from 'docx';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

/**
 * Genera la fecha del cumpleaños en el año actual/próximo.
 */
const obtenerFechaCumpleanos = (fechaNacimiento) => {
  if (!fechaNacimiento) return { dia: '', mes: '', anio: '' };
  const nacimiento = dayjs(fechaNacimiento);
  const hoy = dayjs();
  let cumple = dayjs().year(hoy.year()).month(nacimiento.month()).date(nacimiento.date());
  if (cumple.isBefore(hoy, 'day')) {
    cumple = cumple.add(1, 'year');
  }
  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  ];
  return {
    dia: cumple.date().toString(),
    mes: meses[cumple.month()],
    anio: cumple.year().toString(),
  };
};

/**
 * Carga una imagen desde una URL y la devuelve como ArrayBuffer.
 */
const loadImageAsBuffer = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return await blob.arrayBuffer();
};

/**
 * Genera y descarga la tarjeta de cumpleaños en formato Word (.docx).
 * Réplica fiel del diseño institucional.
 */
export const generarTarjetaCumpleanosPDF = async (persona) => {
  const fecha = obtenerFechaCumpleanos(persona.fechaNacimiento);

  // Cargar imágenes
  let emblemLeftBuf, badgeRightBuf, watermarkBuf;
  try {
    [emblemLeftBuf, badgeRightBuf, watermarkBuf] = await Promise.all([
      loadImageAsBuffer('/emblem_left.png'),
      loadImageAsBuffer('/badge_anniversary.png'),
      loadImageAsBuffer('/watermark_center.png'),
    ]);
  } catch (err) {
    console.warn('No se pudieron cargar algunas imágenes:', err);
  }

  // ═══════ CONSTRUIR ENCABEZADO CON IMÁGENES Y TÍTULO ═══════

  // Fila de encabezado: [Emblema izquierdo] [Título central] [Badge derecho]
  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          // Columna izquierda: emblema
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: emblemLeftBuf
                  ? [
                      new ImageRun({
                        data: emblemLeftBuf,
                        transformation: { width: 65, height: 65 },
                        type: 'png',
                      }),
                    ]
                  : [],
              }),
            ],
          }),
          // Columna central: título
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 40 },
                children: [
                  new TextRun({
                    text: 'El JEFE DEL ESCUADRÓN DE SEGURIDAD VIAL',
                    bold: true,
                    size: 24,
                    font: 'Arial',
                    color: '001F64',
                    underline: { type: 'single' },
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: '\u201CSANTA CATALINA\u201D',
                    bold: true,
                    size: 24,
                    font: 'Arial',
                    color: '001F64',
                  }),
                ],
              }),
            ],
          }),
          // Columna derecha: badge
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: badgeRightBuf
                  ? [
                      new ImageRun({
                        data: badgeRightBuf,
                        transformation: { width: 70, height: 70 },
                        type: 'png',
                      }),
                    ]
                  : [],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // ═══════ CONSTRUIR DOCUMENTO ═══════
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: PageOrientation.LANDSCAPE,
              width: convertInchesToTwip(7.7),
              height: convertInchesToTwip(5.8),
            },
            margin: {
              top: convertInchesToTwip(0.4),
              bottom: convertInchesToTwip(0.3),
              left: convertInchesToTwip(0.6),
              right: convertInchesToTwip(0.6),
            },
            borders: {
              pageBorderTop: {
                style: BorderStyle.DOUBLE,
                size: 12,
                color: '003C96',
                space: 10,
              },
              pageBorderBottom: {
                style: BorderStyle.DOUBLE,
                size: 12,
                color: '003C96',
                space: 10,
              },
              pageBorderLeft: {
                style: BorderStyle.DOUBLE,
                size: 12,
                color: '003C96',
                space: 10,
              },
              pageBorderRight: {
                style: BorderStyle.DOUBLE,
                size: 12,
                color: '003C96',
                space: 10,
              },
            },
          },
        },
        children: [
          // ── Encabezado con imágenes y título ──
          headerTable,

          // ── Espacio ──
          new Paragraph({ spacing: { before: 80 } }),

          // ── Comandante (alineado a la derecha) ──
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { after: 0 },
            children: [
              new TextRun({
                text: 'JOSE MARCELO SKIEBACK',
                bold: true,
                italics: true,
                size: 18,
                font: 'Arial',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'COMANDANTE PRINCIPAL',
                bold: true,
                italics: true,
                size: 17,
                font: 'Arial',
              }),
            ],
          }),

          // ── Párrafo 1 ──
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 160 },
            indent: { left: convertInchesToTwip(0.3), right: convertInchesToTwip(0.3) },
            children: [
              new TextRun({
                text: `Desea hacerle llegar al ${persona.nombreCompleto}, mi m\u00e1s sincero saludo y felicitaci\u00f3n al conmemorarse un Aniversario m\u00e1s de su natalicio.`,
                italics: true,
                size: 21,
                font: 'Arial',
              }),
            ],
          }),

          // ── Párrafo 2 ──
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 160 },
            indent: { left: convertInchesToTwip(0.3), right: convertInchesToTwip(0.3) },
            children: [
              new TextRun({
                text: 'En este d\u00eda tan especial, vaya mi reconocimiento hacia su persona, acompa\u00f1\u00e1ndolo con los mejores deseos de bienestar, salud y prosperidad, invocando que el Se\u00f1or ilumine su caminar y que el nuevo a\u00f1o que comienza este colmado de logros personales y profesionales.',
                italics: true,
                size: 21,
                font: 'Arial',
              }),
            ],
          }),

          // ── Párrafo 3: despedida ──
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 280 },
            children: [
              new TextRun({
                text: 'Sin otro motivo, lo saluda muy atentamente. -',
                italics: true,
                size: 21,
                font: 'Arial',
              }),
            ],
          }),

          // ── Fecha (centrada) ──
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: `SANTA CATALINA (CBA), ${fecha.dia} DE ${fecha.mes}`,
                size: 19,
                font: 'Arial',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: `DE ${fecha.anio}.-`,
                size: 19,
                font: 'Arial',
              }),
            ],
          }),

          // ── AL nombre completo ──
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: `AL ${persona.nombreCompleto}`,
                bold: true,
                size: 20,
                font: 'Arial',
              }),
            ],
          }),

          // ── PRESENTE ──
          new Paragraph({
            indent: { left: convertInchesToTwip(0.3) },
            children: [
              new TextRun({
                text: 'PRESENTE',
                bold: true,
                size: 20,
                font: 'Arial',
              }),
            ],
          }),
        ],
      },
    ],
  });

  // ═══════ GENERAR Y DESCARGAR ═══════
  const blob = await Packer.toBlob(doc);
  const fileName = `Tarjeta_Cumpleanos_${persona.nombreCompleto.replace(/\s+/g, '_')}.docx`;
  saveAs(blob, fileName);
};
