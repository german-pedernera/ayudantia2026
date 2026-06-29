import { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  Paper,
  InputAdornment,
  Chip,
  CardActions,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import AlarmIcon from '@mui/icons-material/Alarm';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import { useRecordatorios } from '../hooks/useRecordatorios';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import { useSnackbar } from 'notistack';

const emptyForm = {
  titulo: '',
  descripcion: '',
  fechaHora: '',
};

const Recordatorios = () => {
  const { recordatorios, loading, addRecordatorio, updateRecordatorio, deleteRecordatorio } = useRecordatorios();
  const { enqueueSnackbar } = useSnackbar();

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, nombre: '' });

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const handleClear = () => {
    setForm(emptyForm);
    setErrors({});
    setEditingId(null);
  };

  const validate = () => {
    const tempErrors = {};
    if (!form.titulo.trim()) tempErrors.titulo = 'El título es obligatorio';
    if (!form.fechaHora) tempErrors.fechaHora = 'La fecha y hora son obligatorias';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      if (editingId) {
        const orig = recordatorios.find(r => r.id === editingId);
        await updateRecordatorio(editingId, {
          ...form,
          notificado: orig ? orig.notificado : false
        });
        enqueueSnackbar('Recordatorio actualizado exitosamente', { variant: 'success' });
      } else {
        await addRecordatorio(form);
        enqueueSnackbar('Recordatorio programado exitosamente', { variant: 'success' });
      }
      handleClear();
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (rem) => {
    setForm({
      titulo: rem.titulo,
      descripcion: rem.descripcion,
      fechaHora: rem.fechaHora,
    });
    setEditingId(rem.id);
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (rem) => {
    setDeleteDialog({
      open: true,
      id: rem.id,
      nombre: rem.titulo,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteRecordatorio(deleteDialog.id);
      enqueueSnackbar('Recordatorio eliminado exitosamente', { variant: 'success' });
      if (editingId === deleteDialog.id) handleClear();
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    } finally {
      setDeleteDialog({ open: false, id: null, nombre: '' });
    }
  };

  const handleToggleNotificado = async (rem) => {
    try {
      await updateRecordatorio(rem.id, {
        titulo: rem.titulo,
        descripcion: rem.descripcion,
        fechaHora: rem.fechaHora,
        notificado: !rem.notificado
      });
      enqueueSnackbar(`Recordatorio marcado como ${!rem.notificado ? 'notificado' : 'pendiente'}`, { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  };

  const filteredRecordatorios = useMemo(() => {
    return recordatorios.filter(
      (r) =>
        r.titulo.toLowerCase().includes(search.toLowerCase()) ||
        r.descripcion.toLowerCase().includes(search.toLowerCase())
    );
  }, [recordatorios, search]);

  const { pendientes, completados } = useMemo(() => {
    const pend = [];
    const comp = [];
    filteredRecordatorios.forEach(r => {
      if (r.notificado) {
        comp.push(r);
      } else {
        pend.push(r);
      }
    });
    return { pendientes: pend, completados: comp };
  }, [filteredRecordatorios]);

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
          Recordatorios y Anotaciones
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Formulario */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ position: 'sticky', top: 88 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                {editingId ? 'Editar Recordatorio' : 'Crear Recordatorio'}
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <TextField
                      label="Título del Recordatorio"
                      fullWidth
                      value={form.titulo}
                      onChange={handleChange('titulo')}
                      error={!!errors.titulo}
                      helperText={errors.titulo}
                      required
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      label="Fecha y Hora Límite"
                      type="datetime-local"
                      fullWidth
                      value={form.fechaHora}
                      onChange={handleChange('fechaHora')}
                      error={!!errors.fechaHora}
                      helperText={errors.fechaHora}
                      slotProps={{ inputLabel: { shrink: true } }}
                      required
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      label="Anotaciones / Notas"
                      multiline
                      rows={4}
                      fullWidth
                      value={form.descripcion}
                      onChange={handleChange('descripcion')}
                      placeholder="Escribe aquí los detalles del recordatorio..."
                    />
                  </Grid>
                  <Grid size={12} sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="secondary"
                      onClick={handleClear}
                      startIcon={<ClearIcon />}
                      disabled={saving}
                    >
                      Limpiar
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      type="submit"
                      startIcon={editingId ? <SaveIcon /> : <AddIcon />}
                      disabled={saving}
                    >
                      {editingId ? 'Guardar' : 'Crear'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Listado */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ mb: 3 }}>
            <TextField
              placeholder="Buscar por título o contenido..."
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <PendingActionsIcon color="primary" /> Pendientes ({pendientes.length})
          </Typography>
          {pendientes.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center', mb: 4, bgcolor: 'background.paper', borderRadius: 3 }}>
              <Typography variant="body1" color="text.secondary">
                No hay recordatorios pendientes. ¡Todo al día!
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {pendientes.map((rem) => {
                const isOverdue = new Date(rem.fechaHora) < new Date();
                return (
                  <Grid size={{ xs: 12, sm: 6 }} key={rem.id}>
                    <Card
                      sx={{
                        borderLeft: `5px solid ${isOverdue ? '#ef5350' : '#1565c0'}`,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                        },
                      }}
                    >
                      <CardContent sx={{ pb: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                            {rem.titulo}
                          </Typography>
                          <Chip
                            size="small"
                            icon={isOverdue ? <NotificationImportantIcon /> : <AlarmIcon />}
                            label={isOverdue ? 'Vencido' : 'Pendiente'}
                            color={isOverdue ? 'error' : 'primary'}
                            variant="outlined"
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5, fontWeight: 500 }}>
                          Fecha Límite: {new Date(rem.fechaHora).toLocaleString('es-AR', {
                            dateStyle: 'short',
                            timeStyle: 'short'
                          })} hs.
                        </Typography>
                        <Typography variant="body2" color="text.primary" sx={{ whiteSpace: 'pre-line' }}>
                          {rem.descripcion || <i>Sin anotaciones adicionales.</i>}
                        </Typography>
                      </CardContent>
                      <Box>
                        <Divider sx={{ mx: 2, opacity: 0.5 }} />
                        <CardActions sx={{ justifyContent: 'flex-end', px: 2, py: 1 }}>
                          <Tooltip title="Marcar como Notificado">
                            <IconButton size="small" onClick={() => handleToggleNotificado(rem)} color="success">
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar">
                            <IconButton size="small" onClick={() => handleEdit(rem)} color="primary">
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton size="small" onClick={() => handleDeleteClick(rem)} color="error">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </CardActions>
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon color="success" /> Notificados / Completados ({completados.length})
          </Typography>
          {completados.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 3 }}>
              <Typography variant="body1" color="text.secondary">
                No hay recordatorios completados.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={2}>
              {completados.map((rem) => (
                <Grid size={{ xs: 12, sm: 6 }} key={rem.id}>
                  <Card
                    sx={{
                      borderLeft: '5px solid #66bb6a',
                      opacity: 0.75,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      '&:hover': {
                        opacity: 1,
                      },
                    }}
                  >
                    <CardContent sx={{ pb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, textDecoration: 'line-through', color: 'text.secondary' }}>
                          {rem.titulo}
                        </Typography>
                        <Chip
                          size="small"
                          icon={<CheckCircleIcon />}
                          label="Completado"
                          color="success"
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                        Límite: {new Date(rem.fechaHora).toLocaleString('es-AR', {
                          dateStyle: 'short',
                          timeStyle: 'short'
                        })} hs.
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                        {rem.descripcion}
                      </Typography>
                    </CardContent>
                    <Box>
                      <Divider sx={{ mx: 2, opacity: 0.5 }} />
                      <CardActions sx={{ justifyContent: 'flex-end', px: 2, py: 1 }}>
                        <Tooltip title="Marcar como Pendiente">
                          <IconButton size="small" onClick={() => handleToggleNotificado(rem)} color="warning">
                            <PendingActionsIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton size="small" onClick={() => handleDeleteClick(rem)} color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </CardActions>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>

      <ConfirmDialog
        open={deleteDialog.open}
        title="Eliminar Recordatorio"
        message={`¿Está seguro de que desea eliminar el recordatorio "${deleteDialog.nombre}"?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog({ open: false, id: null, nombre: '' })}
      />
    </Box>
  );
};

export default Recordatorios;
