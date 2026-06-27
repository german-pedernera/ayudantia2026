import { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  IconButton,
  Tooltip,
  Paper,
  InputAdornment,
  Chip,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useInstituciones } from '../hooks/useInstituciones';
import { calcularAniosInstitucion, formatearFecha, esHoy } from '../utils/dateUtils';
import { exportToPDF } from '../utils/exportUtils';
import { validarInstitucion } from '../utils/validators';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import { useSnackbar } from 'notistack';

const emptyForm = {
  nombreInstitucion: '',
  fechaCreacionInstitucion: null,
  direccion: '',
  responsable: '',
  telefono: '',
  observaciones: '',
};

const Instituciones = () => {
  const { instituciones, loading, addInstitucion, updateInstitucion, deleteInstitucion } = useInstituciones();
  const { enqueueSnackbar } = useSnackbar();

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState('nombreInstitucion');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, nombre: '' });

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const handleDateChange = (date) => {
    setForm({ ...form, fechaCreacionInstitucion: date ? date.format('YYYY-MM-DD') : null });
    if (errors.fechaCreacionInstitucion) setErrors({ ...errors, fechaCreacionInstitucion: '' });
  };

  const handleClear = () => {
    setForm(emptyForm);
    setErrors({});
    setEditingId(null);
  };

  const handleSubmit = async () => {
    const validationErrors = validarInstitucion(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await updateInstitucion(editingId, form);
        enqueueSnackbar('Institución actualizada exitosamente', { variant: 'success' });
      } else {
        await addInstitucion(form);
        enqueueSnackbar('Institución registrada exitosamente', { variant: 'success' });
      }
      handleClear();
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (inst) => {
    setForm({
      nombreInstitucion: inst.nombreInstitucion,
      fechaCreacionInstitucion: inst.fechaCreacionInstitucion,
      direccion: inst.direccion,
      responsable: inst.responsable,
      telefono: inst.telefono,
      observaciones: inst.observaciones || '',
    });
    setEditingId(inst.id);
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (inst) => {
    setDeleteDialog({
      open: true,
      id: inst.id,
      nombre: inst.nombreInstitucion,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteInstitucion(deleteDialog.id);
      enqueueSnackbar('Institución eliminada exitosamente', { variant: 'success' });
      if (editingId === deleteDialog.id) handleClear();
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    } finally {
      setDeleteDialog({ open: false, id: null, nombre: '' });
    }
  };

  const handleSort = (field) => {
    const isAsc = orderBy === field && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(field);
  };

  const filteredInstituciones = useMemo(() => {
    let filtered = instituciones.filter((i) => {
      const searchLower = search.toLowerCase();
      return (
        i.nombreInstitucion.toLowerCase().includes(searchLower) ||
        i.responsable.toLowerCase().includes(searchLower) ||
        i.direccion.toLowerCase().includes(searchLower) ||
        i.telefono.includes(search)
      );
    });

    filtered.sort((a, b) => {
      let aVal = a[orderBy] || '';
      let bVal = b[orderBy] || '';
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [instituciones, search, orderBy, order]);

  const handleDownloadPDF = () => {
    try {
      exportToPDF(filteredInstituciones, 'instituciones', 'Planilla de Instituciones');
      enqueueSnackbar('PDF descargado exitosamente', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar('Error al descargar el PDF', { variant: 'error' });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Box>
        {/* Formulario */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <BusinessIcon color="secondary" />
              {editingId ? 'Editar Institución' : 'Registrar Institución'}
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  id="inst-nombre"
                  label="Nombre de la Institución"
                  placeholder="Ej. Escuela N° 123"
                  fullWidth
                  value={form.nombreInstitucion}
                  onChange={handleChange('nombreInstitucion')}
                  error={!!errors.nombreInstitucion}
                  helperText={errors.nombreInstitucion}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <DatePicker
                  label="Fecha de Creación"
                  value={form.fechaCreacionInstitucion ? dayjs(form.fechaCreacionInstitucion) : null}
                  onChange={handleDateChange}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      id: 'inst-fecha',
                      placeholder: 'DD/MM/AAAA',
                      fullWidth: true,
                      error: !!errors.fechaCreacionInstitucion,
                      helperText: errors.fechaCreacionInstitucion,
                      required: true,
                    },
                  }}
                  maxDate={dayjs()}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  id="inst-anios"
                  label="Años"
                  placeholder="Autocalculado"
                  fullWidth
                  value={form.fechaCreacionInstitucion ? `${calcularAniosInstitucion(form.fechaCreacionInstitucion)} años` : ''}
                  InputProps={{ readOnly: true }}
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'action.hover' } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  id="inst-direccion"
                  label="Dirección"
                  placeholder="Ej. Calle Falsa 123"
                  fullWidth
                  value={form.direccion}
                  onChange={handleChange('direccion')}
                  error={!!errors.direccion}
                  helperText={errors.direccion}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  id="inst-responsable"
                  label="Persona Responsable"
                  placeholder="Ej. María Gómez"
                  fullWidth
                  value={form.responsable}
                  onChange={handleChange('responsable')}
                  error={!!errors.responsable}
                  helperText={errors.responsable}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  id="inst-telefono"
                  label="Teléfono"
                  placeholder="Ej. +54 9 11 1234-5678"
                  fullWidth
                  value={form.telefono}
                  onChange={handleChange('telefono')}
                  error={!!errors.telefono}
                  helperText={errors.telefono}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  id="inst-observaciones"
                  label="Observaciones"
                  placeholder="Ej. Información adicional, comentarios..."
                  fullWidth
                  value={form.observaciones}
                  onChange={handleChange('observaciones')}
                  multiline
                  maxRows={2}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 1.5, mt: 3, flexWrap: 'wrap' }}>
              <Button
                id="inst-guardar"
                variant="contained"
                color="secondary"
                startIcon={editingId ? <SaveIcon /> : <AddIcon />}
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Guardar'}
              </Button>
              <Button
                id="inst-limpiar"
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={handleClear}
                color="inherit"
              >
                Limpiar
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Listado */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Listado de Instituciones
                <Chip label={instituciones.length} size="small" color="secondary" sx={{ ml: 1, fontWeight: 700 }} />
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                  id="inst-buscar"
                  placeholder="Buscar institución..."
                  size="small"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ minWidth: 250 }}
                />
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<PictureAsPdfIcon />}
                  onClick={handleDownloadPDF}
                  size="medium"
                  sx={{ height: 40 }}
                >
                  Descargar PDF
                </Button>
              </Box>
            </Box>

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'nombreInstitucion'}
                        direction={orderBy === 'nombreInstitucion' ? order : 'asc'}
                        onClick={() => handleSort('nombreInstitucion')}
                      >
                        Nombre
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'fechaCreacionInstitucion'}
                        direction={orderBy === 'fechaCreacionInstitucion' ? order : 'asc'}
                        onClick={() => handleSort('fechaCreacionInstitucion')}
                      >
                        Fecha Creación
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Años</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Dirección</TableCell>
                    <TableCell>Responsable</TableCell>
                    <TableCell>Teléfono</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredInstituciones.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          {search ? 'No se encontraron resultados' : 'No hay instituciones registradas'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInstituciones
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((inst) => (
                        <TableRow
                          key={inst.id}
                          hover
                          sx={{
                            bgcolor: esHoy(inst.fechaCreacionInstitucion) ? 'rgba(0, 137, 123, 0.06)' : 'inherit',
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {inst.nombreInstitucion}
                              </Typography>
                              {esHoy(inst.fechaCreacionInstitucion) && (
                                <Chip label="🎉 Hoy" size="small" color="secondary" sx={{ fontSize: 11, height: 22 }} />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>{formatearFecha(inst.fechaCreacionInstitucion)}</TableCell>
                          <TableCell>{calcularAniosInstitucion(inst.fechaCreacionInstitucion)} años</TableCell>
                          <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{inst.direccion}</TableCell>
                          <TableCell>{inst.responsable}</TableCell>
                          <TableCell>{inst.telefono}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="Editar">
                              <IconButton size="small" color="secondary" onClick={() => handleEdit(inst)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar">
                              <IconButton size="small" color="error" onClick={() => handleDeleteClick(inst)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={filteredInstituciones.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
              labelRowsPerPage="Filas por página:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
          </CardContent>
        </Card>

        <ConfirmDialog
          open={deleteDialog.open}
          title="Eliminar Institución"
          message={`¿Está seguro que desea eliminar "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteDialog({ open: false, id: null, nombre: '' })}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default Instituciones;
