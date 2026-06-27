import { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  IconButton,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CakeIcon from '@mui/icons-material/Cake';
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import EventIcon from '@mui/icons-material/Event';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import dayjs from 'dayjs';
import { usePersonas } from '../hooks/usePersonas';
import { useInstituciones } from '../hooks/useInstituciones';
import { calcularEdad, calcularAniosInstitucion, formatearFecha } from '../utils/dateUtils';
import LoadingSpinner from '../components/LoadingSpinner';
import { useThemeMode } from '../contexts/ThemeContext';

const Calendario = () => {
  const { personas, loading: lp } = usePersonas();
  const { instituciones, loading: li } = useInstituciones();
  const [selectedDate, setSelectedDate] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const theme = useTheme();
  const { isDark } = useThemeMode();

  // Map all events by "MM-DD" key
  const eventMap = useMemo(() => {
    const map = {};

    personas.forEach((p) => {
      if (!p.fechaNacimiento) return;
      const d = dayjs(p.fechaNacimiento);
      const key = d.format('MM-DD');
      if (!map[key]) map[key] = [];
      map[key].push({
        tipo: 'persona',
        nombre: p.nombreCompleto,
        telefono: p.telefono,
        fecha: p.fechaNacimiento,
        observaciones: p.observaciones,
      });
    });

    instituciones.forEach((i) => {
      if (!i.fechaCreacionInstitucion) return;
      const d = dayjs(i.fechaCreacionInstitucion);
      const key = d.format('MM-DD');
      if (!map[key]) map[key] = [];
      map[key].push({
        tipo: 'institucion',
        nombre: i.nombreInstitucion,
        telefono: i.telefono,
        fecha: i.fechaCreacionInstitucion,
        responsable: i.responsable,
        direccion: i.direccion,
        observaciones: i.observaciones,
      });
    });

    return map;
  }, [personas, instituciones]);

  const getEventsForDate = (date) => {
    const key = dayjs(date).format('MM-DD');
    return eventMap[key] || [];
  };

  const handleDateClick = (date) => {
    const events = getEventsForDate(date);
    if (events.length > 0) {
      setSelectedDate({ date, events });
      setDialogOpen(true);
    }
  };

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const events = getEventsForDate(date);
    if (events.length === 0) return null;

    const hasPersona = events.some((e) => e.tipo === 'persona');
    const hasInstitucion = events.some((e) => e.tipo === 'institucion');

    return (
      <Box sx={{ display: 'flex', gap: 0.3, justifyContent: 'center', mt: 0.3 }}>
        {hasPersona && (
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: '#2196f3',
            }}
          />
        )}
        {hasInstitucion && (
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: '#4caf50',
            }}
          />
        )}
      </Box>
    );
  };

  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return '';
    const events = getEventsForDate(date);
    if (events.length === 0) return '';

    const hasPersona = events.some((e) => e.tipo === 'persona');
    const hasInstitucion = events.some((e) => e.tipo === 'institucion');

    if (hasPersona && hasInstitucion) return 'has-both-events';
    if (hasPersona) return 'has-persona-event';
    if (hasInstitucion) return 'has-institucion-event';
    return '';
  };

  if (lp || li) return <LoadingSpinner />;

  return (
    <Box>
      {/* Legend */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2, display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Referencias:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#2196f3' }} />
            <Typography variant="body2">Cumpleaños</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#4caf50' }} />
            <Typography variant="body2">Aniversarios Institucionales</Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card>
        <CardContent sx={{ p: { xs: 1, sm: 3 } }}>
          <Box
            className={isDark ? 'calendar-dark' : 'calendar-light'}
            sx={{
              '& .react-calendar': {
                width: '100%',
                border: 'none',
                borderRadius: 3,
                fontFamily: '"Inter", sans-serif',
                bgcolor: 'transparent',
                color: theme.palette.text.primary,
              },
              '& .react-calendar__navigation': {
                mb: 1,
              },
              '& .react-calendar__navigation button': {
                color: theme.palette.text.primary,
                fontSize: 16,
                fontWeight: 600,
                borderRadius: 2,
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
                '&:disabled': {
                  bgcolor: 'transparent',
                },
              },
              '& .react-calendar__month-view__weekdays': {
                '& abbr': {
                  textDecoration: 'none',
                  fontWeight: 700,
                  color: theme.palette.text.secondary,
                  fontSize: 13,
                },
              },
              '& .react-calendar__tile': {
                borderRadius: 2,
                py: 1.5,
                border: '4px solid transparent',
                backgroundClip: 'padding-box',
                color: theme.palette.text.primary,
                fontSize: 14,
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
              },
              '& .react-calendar__tile--now': {
                bgcolor: isDark ? 'rgba(66, 165, 245, 0.15)' : 'rgba(21, 101, 192, 0.1)',
                fontWeight: 700,
                '&:hover': {
                  bgcolor: isDark ? 'rgba(66, 165, 245, 0.25)' : 'rgba(21, 101, 192, 0.2)',
                },
              },
              '& .react-calendar__tile--active': {
                bgcolor: theme.palette.primary.main,
                color: '#fff',
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                },
              },
              '& .has-persona-event': {
                bgcolor: isDark ? 'rgba(33, 150, 243, 0.12)' : 'rgba(33, 150, 243, 0.08)',
                cursor: 'pointer',
              },
              '& .has-institucion-event': {
                bgcolor: isDark ? 'rgba(76, 175, 80, 0.12)' : 'rgba(76, 175, 80, 0.08)',
                cursor: 'pointer',
              },
              '& .has-both-events': {
                background: isDark
                  ? 'linear-gradient(135deg, rgba(33,150,243,0.12), rgba(76,175,80,0.12))'
                  : 'linear-gradient(135deg, rgba(33,150,243,0.08), rgba(76,175,80,0.08))',
                cursor: 'pointer',
              },
              '& .react-calendar__month-view__days__day--neighboringMonth': {
                color: theme.palette.text.disabled,
              },
            }}
          >
            <Calendar
              onClickDay={handleDateClick}
              tileContent={tileContent}
              tileClassName={tileClassName}
              locale="es-ES"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Event Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {selectedDate && dayjs(selectedDate.date).format('DD [de] MMMM')}
            </Typography>
          </Box>
          <IconButton onClick={() => setDialogOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedDate && (
            <List>
              {selectedDate.events.map((event, index) => (
                <ListItem
                  key={index}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    bgcolor: event.tipo === 'persona'
                      ? 'rgba(33, 150, 243, 0.06)'
                      : 'rgba(76, 175, 80, 0.06)',
                    border: `1px solid ${event.tipo === 'persona'
                      ? 'rgba(33, 150, 243, 0.2)'
                      : 'rgba(76, 175, 80, 0.2)'}`,
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    p: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, width: '100%' }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      {event.tipo === 'persona' ? (
                        <CakeIcon sx={{ color: '#2196f3' }} />
                      ) : (
                        <BusinessIcon sx={{ color: '#4caf50' }} />
                      )}
                    </ListItemIcon>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, flex: 1 }}>
                      {event.nombre}
                    </Typography>
                    <Chip
                      label={event.tipo === 'persona' ? 'Cumpleaños' : 'Aniversario'}
                      size="small"
                      sx={{
                        bgcolor: event.tipo === 'persona' ? '#2196f3' : '#4caf50',
                        color: '#fff',
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  <Box sx={{ pl: 5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {event.tipo === 'persona' ? (
                      <Typography variant="body2" color="text.secondary">
                        Edad actual: <strong>{calcularEdad(event.fecha)} años</strong>
                      </Typography>
                    ) : (
                      <>
                        <Typography variant="body2" color="text.secondary">
                          Antigüedad: <strong>{calcularAniosInstitucion(event.fecha)} años</strong>
                        </Typography>
                        {event.responsable && (
                          <Typography variant="body2" color="text.secondary">
                            Responsable: <strong>{event.responsable}</strong>
                          </Typography>
                        )}
                        {event.direccion && (
                          <Typography variant="body2" color="text.secondary">
                            Dirección: {event.direccion}
                          </Typography>
                        )}
                      </>
                    )}
                    {event.telefono && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {event.telefono}
                        </Typography>
                      </Box>
                    )}
                    {event.observaciones && (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 0.5 }}>
                        {event.observaciones}
                      </Typography>
                    )}
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Calendario;
