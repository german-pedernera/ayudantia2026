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
  MenuItem,
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
import CakeIcon from '@mui/icons-material/Cake';
import { usePersonas } from '../hooks/usePersonas';
import { calcularEdad, formatearFecha, esHoy } from '../utils/dateUtils';
import { validarPersona } from '../utils/validators';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import { useSnackbar } from 'notistack';

import { JERARQUIAS } from '../utils/constants';

const emptyForm = {
  nombreCompleto: '',
  fechaNacimiento: null,
  telefono: '',
  jerarquia: '',
  unidad: '',
};

const Personas = () => {
  const { personas, loading, addPersona, updatePersona, deletePersona } = usePersonas();
  const { enqueueSnackbar } = useSnackbar();

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Table state
  const [search, setSearch] = useState('');
  const [filterMonth, setFilterMonth] = useState('all');
  const [orderBy, setOrderBy] = useState('mesJerarquia');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Delete dialog
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, nombre: '' });

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const handleDateChange = (date) => {
    setForm({ ...form, fechaNacimiento: date ? date.format('YYYY-MM-DD') : null });
    if (errors.fechaNacimiento) setErrors({ ...errors, fechaNacimiento: '' });
  };

  const handleClear = () => {
    setForm(emptyForm);
    setErrors({});
    setEditingId(null);
  };

  const handleSubmit = async () => {
    const validationErrors = validarPersona(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await updatePersona(editingId, form);
        enqueueSnackbar('Persona actualizada exitosamente', { variant: 'success' });
      } else {
        await addPersona(form);
        enqueueSnackbar('Persona registrada exitosamente', { variant: 'success' });
      }
      handleClear();
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (persona) => {
    setForm({
      nombreCompleto: persona.nombreCompleto,
      fechaNacimiento: persona.fechaNacimiento,
      telefono: persona.telefono,
      jerarquia: persona.jerarquia || '',
      unidad: persona.unidad || '',
    });
    setEditingId(persona.id);
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (persona) => {
    setDeleteDialog({
      open: true,
      id: persona.id,
      nombre: persona.nombreCompleto,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePersona(deleteDialog.id);
      enqueueSnackbar('Persona eliminada exitosamente', { variant: 'success' });
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

  const filteredPersonas = useMemo(() => {
    let filtered = personas.filter((p) => {
      const searchLower = search.toLowerCase();
      const matchesSearch = 
        p.nombreCompleto.toLowerCase().includes(searchLower) ||
        p.telefono.includes(search);

      let matchesMonth = true;
      if (filterMonth !== 'all' && p.fechaNacimiento) {
        // Usamos dayjs para evitar problemas de parseo y zona horaria
        const birthMonth = dayjs(p.fechaNacimiento).month() + 1;
        matchesMonth = birthMonth === parseInt(filterMonth);
      } else if (filterMonth !== 'all') {
        matchesMonth = false;
      }

      return matchesSearch && matchesMonth;
    });

    filtered.sort((a, b) => {
      let aVal, bVal;
      if (orderBy === 'mesJerarquia') {
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
          aVal = aMonth;
          bVal = bMonth;
        } else {
          const aDay = getDay(a.fechaNacimiento);
          const bDay = getDay(b.fechaNacimiento);
          if (aDay !== bDay) {
            aVal = aDay;
            bVal = bDay;
          } else {
            aVal = getJerarquiaIndex(a.jerarquia);
            bVal = getJerarquiaIndex(b.jerarquia);
          }
        }
      } else if (orderBy === 'jerarquia') {
        const getJerarquiaIndex = (j) => {
          const idx = JERARQUIAS.indexOf(j);
          return idx === -1 ? 99 : idx;
        };
        aVal = getJerarquiaIndex(a.jerarquia);
        bVal = getJerarquiaIndex(b.jerarquia);
      } else if (orderBy === 'nombre') {
        aVal = a.nombreCompleto.toLowerCase();
        bVal = b.nombreCompleto.toLowerCase();
      } else if (orderBy === 'unidad') {
        aVal = (a.unidad || '').toLowerCase();
        bVal = (b.unidad || '').toLowerCase();
      } else if (orderBy === 'fechaNacimiento') {
        aVal = a.fechaNacimiento;
        bVal = b.fechaNacimiento;
      } else if (orderBy === 'edad') {
        aVal = calcularEdad(a.fechaNacimiento);
        bVal = calcularEdad(b.fechaNacimiento);
      } else {
        aVal = a[orderBy];
        bVal = b[orderBy];
      }

      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [personas, search, filterMonth, orderBy, order]);

  if (loading) return <LoadingSpinner />;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Box>
        {/* Formulario */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CakeIcon color="primary" />
              {editingId ? 'Editar Persona' : 'Registrar Persona'}
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <TextField
                  id="persona-nombre-completo"
                  label="Nombre Completo"
                  placeholder="Ej. Pérez Juan"
                  fullWidth
                  value={form.nombreCompleto}
                  onChange={handleChange('nombreCompleto')}
                  error={!!errors.nombreCompleto}
                  helperText={errors.nombreCompleto}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <DatePicker
                  label="Fecha de Nacimiento"
                  value={form.fechaNacimiento ? dayjs(form.fechaNacimiento) : null}
                  onChange={handleDateChange}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      id: 'persona-fecha',
                      placeholder: 'DD/MM/AAAA',
                      fullWidth: true,
                      error: !!errors.fechaNacimiento,
                      helperText: errors.fechaNacimiento,
                      required: true,
                    },
                  }}
                  maxDate={dayjs()}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  id="persona-edad"
                  label="Edad"
                  placeholder="Autocalculada"
                  fullWidth
                  value={form.fechaNacimiento ? `${calcularEdad(form.fechaNacimiento)} años` : ''}
                  InputProps={{ readOnly: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'action.hover',
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  id="persona-telefono"
                  label="Teléfono"
                  placeholder="Ej. +54 9 11 1234-5678"
                  fullWidth
                  value={form.telefono}
                  onChange={handleChange('telefono')}
                  error={!!errors.telefono}
                  helperText={errors.telefono}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  id="persona-jerarquia"
                  select
                  label="Jerarquía"
                  fullWidth
                  value={form.jerarquia}
                  onChange={handleChange('jerarquia')}
                >
                  <MenuItem value=""><em>Ninguna / Otra</em></MenuItem>
                  {JERARQUIAS.map((j) => (
                    <MenuItem key={j} value={j}>{j}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  id="persona-unidad"
                  select
                  label="Unidad"
                  fullWidth
                  value={form.unidad}
                  onChange={handleChange('unidad')}
                >
                  <MenuItem value=""><em>Ninguna</em></MenuItem>
                  <MenuItem value="Esvicatalina">Esvicatalina</MenuItem>
                  <MenuItem value="Seviapun">Seviapun</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 1.5, mt: 3, flexWrap: 'wrap' }}>
              <Button
                id="persona-guardar"
                variant="contained"
                startIcon={editingId ? <SaveIcon /> : <AddIcon />}
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Guardar'}
              </Button>
              <Button
                id="persona-limpiar"
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
                Listado de Personas
                <Chip label={filteredPersonas.length} size="small" color="primary" sx={{ ml: 1, fontWeight: 700 }} />
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  id="persona-filtro-mes"
                  select
                  size="small"
                  value={filterMonth}
                  onChange={(e) => { setFilterMonth(e.target.value); setPage(0); }}
                  sx={{ minWidth: 160 }}
                  label="Mes de Nacimiento"
                >
                  <MenuItem value="all">Todos los meses</MenuItem>
                  <MenuItem value="1">Enero</MenuItem>
                  <MenuItem value="2">Febrero</MenuItem>
                  <MenuItem value="3">Marzo</MenuItem>
                  <MenuItem value="4">Abril</MenuItem>
                  <MenuItem value="5">Mayo</MenuItem>
                  <MenuItem value="6">Junio</MenuItem>
                  <MenuItem value="7">Julio</MenuItem>
                  <MenuItem value="8">Agosto</MenuItem>
                  <MenuItem value="9">Septiembre</MenuItem>
                  <MenuItem value="10">Octubre</MenuItem>
                  <MenuItem value="11">Noviembre</MenuItem>
                  <MenuItem value="12">Diciembre</MenuItem>
                </TextField>
                <TextField
                  id="persona-buscar"
                  placeholder="Buscar persona..."
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
              </Box>
            </Box>

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'jerarquia'}
                        direction={orderBy === 'jerarquia' ? order : 'asc'}
                        onClick={() => handleSort('jerarquia')}
                      >
                        Jerarquía
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'nombre'}
                        direction={orderBy === 'nombre' ? order : 'asc'}
                        onClick={() => handleSort('nombre')}
                      >
                        Nombre Completo
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'unidad'}
                        direction={orderBy === 'unidad' ? order : 'asc'}
                        onClick={() => handleSort('unidad')}
                      >
                        Unidad
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'fechaNacimiento'}
                        direction={orderBy === 'fechaNacimiento' ? order : 'asc'}
                        onClick={() => handleSort('fechaNacimiento')}
                      >
                        Fecha Nacimiento
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'edad'}
                        direction={orderBy === 'edad' ? order : 'asc'}
                        onClick={() => handleSort('edad')}
                      >
                        Edad
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Teléfono</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPersonas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          {search ? 'No se encontraron resultados' : 'No hay personas registradas'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPersonas
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((persona) => (
                        <TableRow
                          key={persona.id}
                          hover
                          sx={{
                            bgcolor: esHoy(persona.fechaNacimiento) ? 'rgba(21, 101, 192, 0.06)' : 'inherit',
                          }}
                        >
                          <TableCell>{persona.jerarquia || '-'}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {persona.nombreCompleto}
                              </Typography>
                              {esHoy(persona.fechaNacimiento) && (
                                <Chip label="🎂 Hoy" size="small" color="primary" sx={{ fontSize: 11, height: 22 }} />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>{persona.unidad || '-'}</TableCell>
                          <TableCell>{formatearFecha(persona.fechaNacimiento)}</TableCell>
                          <TableCell>{calcularEdad(persona.fechaNacimiento)} años</TableCell>
                          <TableCell>{persona.telefono}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="Editar">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleEdit(persona)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteClick(persona)}
                              >
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
              count={filteredPersonas.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
              labelRowsPerPage="Filas por página:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
          </CardContent>
        </Card>

        {/* Delete Confirmation */}
        <ConfirmDialog
          open={deleteDialog.open}
          title="Eliminar Persona"
          message={`¿Está seguro que desea eliminar a ${deleteDialog.nombre}? Esta acción no se puede deshacer.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteDialog({ open: false, id: null, nombre: '' })}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default Personas;
