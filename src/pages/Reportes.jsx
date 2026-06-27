import { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Divider,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import EventIcon from '@mui/icons-material/Event';
import DownloadIcon from '@mui/icons-material/Download';
import { usePersonas } from '../hooks/usePersonas';
import { useInstituciones } from '../hooks/useInstituciones';
import { useAniversarios } from '../hooks/useAniversarios';
import { calcularEdad, calcularAniosInstitucion, formatearFecha } from '../utils/dateUtils';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';
import { sortPersonasDefault } from '../utils/sortUtils';
import LoadingSpinner from '../components/LoadingSpinner';
import { useSnackbar } from 'notistack';

const Reportes = () => {
  const { personas, loading: lp } = usePersonas();
  const { instituciones, loading: li } = useInstituciones();
  const { todosProximos } = useAniversarios(personas, instituciones);
  const { enqueueSnackbar } = useSnackbar();
  const [tipo, setTipo] = useState('personas');

  const handleExportPDF = () => {
    try {
      const titulos = {
        personas: 'Reporte de Personas',
        instituciones: 'Reporte de Instituciones',
        aniversarios: 'Próximos Aniversarios',
      };
      const sortedPersonas = sortPersonasDefault(personas);
      const data = tipo === 'personas' ? sortedPersonas : tipo === 'instituciones' ? instituciones : todosProximos;
      exportToPDF(data, tipo, titulos[tipo]);
      enqueueSnackbar('PDF generado exitosamente', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar('Error al generar PDF', { variant: 'error' });
    }
  };

  const handleExportExcel = () => {
    try {
      const titulos = {
        personas: 'Reporte de Personas',
        instituciones: 'Reporte de Instituciones',
        aniversarios: 'Próximos Aniversarios',
      };
      const sortedPersonas = sortPersonasDefault(personas);
      const data = tipo === 'personas' ? sortedPersonas : tipo === 'instituciones' ? instituciones : todosProximos;
      exportToExcel(data, tipo, titulos[tipo]);
      enqueueSnackbar('Excel generado exitosamente', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar('Error al generar Excel', { variant: 'error' });
    }
  };

  if (lp || li) return <LoadingSpinner />;

  return (
    <Box>
      {/* Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <DownloadIcon color="primary" />
            Generar Reportes
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <ToggleButtonGroup
              value={tipo}
              exclusive
              onChange={(_, val) => val && setTipo(val)}
              size="small"
            >
              <ToggleButton value="personas">
                <PeopleIcon sx={{ mr: 0.5, fontSize: 18 }} /> Personas
              </ToggleButton>
              <ToggleButton value="instituciones">
                <BusinessIcon sx={{ mr: 0.5, fontSize: 18 }} /> Instituciones
              </ToggleButton>
              <ToggleButton value="aniversarios">
                <EventIcon sx={{ mr: 0.5, fontSize: 18 }} /> Próximos Aniversarios
              </ToggleButton>
            </ToggleButtonGroup>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="error"
                startIcon={<PictureAsPdfIcon />}
                onClick={handleExportPDF}
                sx={{ bgcolor: '#c62828' }}
              >
                Exportar PDF
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<TableChartIcon />}
                onClick={handleExportExcel}
              >
                Exportar Excel
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Vista Previa
            <Chip
              label={
                tipo === 'personas'
                  ? `${personas.length} registros`
                  : tipo === 'instituciones'
                  ? `${instituciones.length} registros`
                  : `${todosProximos.length} próximos`
              }
              size="small"
              color="primary"
              sx={{ ml: 1, fontWeight: 600 }}
            />
          </Typography>

          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            {tipo === 'personas' && (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Jerarquía</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Nombre Completo</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Unidad</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Fecha Nac.</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Edad</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Teléfono</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortPersonasDefault(personas).map((p) => (
                    <TableRow key={p.id} hover>
                      <TableCell>{p.jerarquia || '-'}</TableCell>
                      <TableCell>{p.nombreCompleto}</TableCell>
                      <TableCell>{p.unidad || '-'}</TableCell>
                      <TableCell>{formatearFecha(p.fechaNacimiento)}</TableCell>
                      <TableCell>{calcularEdad(p.fechaNacimiento)}</TableCell>
                      <TableCell>{p.telefono}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {tipo === 'instituciones' && (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Institución</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Fecha Creación</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Años</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Responsable</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Teléfono</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {instituciones.map((i) => (
                    <TableRow key={i.id} hover>
                      <TableCell>{i.nombreInstitucion}</TableCell>
                      <TableCell>{formatearFecha(i.fechaCreacionInstitucion)}</TableCell>
                      <TableCell>{calcularAniosInstitucion(i.fechaCreacionInstitucion)}</TableCell>
                      <TableCell>{i.responsable}</TableCell>
                      <TableCell>{i.telefono}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {tipo === 'aniversarios' && (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Nombre</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Tipo</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Fecha</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Edad/Años</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Días Restantes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {todosProximos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                        <Typography color="text.secondary">No hay aniversarios próximos</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    todosProximos.map((item, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell>{item.nombre}</TableCell>
                        <TableCell>
                          <Chip
                            label={item.tipoLabel}
                            size="small"
                            sx={{
                              bgcolor: item.tipo === 'persona' ? '#2196f3' : '#4caf50',
                              color: '#fff',
                              fontWeight: 600,
                              fontSize: 11,
                            }}
                          />
                        </TableCell>
                        <TableCell>{item.proximaFecha}</TableCell>
                        <TableCell>
                          {item.tipo === 'persona' ? item.edadCumple : item.aniosCumple}
                        </TableCell>
                        <TableCell>
                          {item.diasRestantes === 0 ? (
                            <Chip label="¡Hoy!" size="small" color="error" sx={{ fontWeight: 700 }} />
                          ) : (
                            `${item.diasRestantes} día${item.diasRestantes !== 1 ? 's' : ''}`
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Reportes;
