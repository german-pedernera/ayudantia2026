import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  useTheme,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import CakeIcon from '@mui/icons-material/Cake';
import TodayIcon from '@mui/icons-material/Today';
import CelebrationIcon from '@mui/icons-material/Celebration';
import EventIcon from '@mui/icons-material/Event';
import PhoneIcon from '@mui/icons-material/Phone';
import { usePersonas } from '../hooks/usePersonas';
import { useInstituciones } from '../hooks/useInstituciones';
import { useAniversarios } from '../hooks/useAniversarios';
import LoadingSpinner from '../components/LoadingSpinner';

const StatCard = ({ title, value, icon, color, gradient }) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 25px ${color}40`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5, fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: color }}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 3,
              background: gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 14px ${color}40`,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const { personas, loading: loadingPersonas } = usePersonas();
  const { instituciones, loading: loadingInstituciones } = useInstituciones();
  const { proximosCumpleanos, proximosAniversarios, stats } = useAniversarios(
    personas,
    instituciones
  );

  if (loadingPersonas || loadingInstituciones) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Personas"
            value={stats.totalPersonas}
            color="#1565c0"
            gradient="linear-gradient(135deg, #1565c0, #42a5f5)"
            icon={<PeopleIcon sx={{ color: '#fff', fontSize: 28 }} />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Instituciones"
            value={stats.totalInstituciones}
            color="#00897b"
            gradient="linear-gradient(135deg, #00897b, #4db6ac)"
            icon={<BusinessIcon sx={{ color: '#fff', fontSize: 28 }} />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Esta Semana"
            value={stats.aniversariosSemana}
            color="#e65100"
            gradient="linear-gradient(135deg, #e65100, #ff9800)"
            icon={<EventIcon sx={{ color: '#fff', fontSize: 28 }} />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Hoy"
            value={stats.aniversariosHoy}
            color="#c62828"
            gradient="linear-gradient(135deg, #c62828, #ef5350)"
            icon={<TodayIcon sx={{ color: '#fff', fontSize: 28 }} />}
          />
        </Grid>
      </Grid>

      {/* Próximos 7 días */}
      <Grid container spacing={3}>
        {/* Próximos Cumpleaños */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CakeIcon sx={{ color: '#1565c0' }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Próximos Cumpleaños
                </Typography>
                <Chip
                  label={`${proximosCumpleanos.length}`}
                  size="small"
                  color="primary"
                  sx={{ fontWeight: 700 }}
                />
              </Box>
              <Divider sx={{ mb: 1 }} />
              {proximosCumpleanos.length === 0 ? (
                <Typography variant="body2" sx={{ color: 'text.secondary', py: 3, textAlign: 'center' }}>
                  No hay cumpleaños en los próximos 7 días
                </Typography>
              ) : (
                <List dense>
                  {proximosCumpleanos.map((item) => (
                    <ListItem
                      key={item.id}
                      sx={{
                        borderRadius: 2,
                        mb: 0.5,
                        bgcolor: item.diasRestantes === 0 ? 'rgba(21, 101, 192, 0.08)' : 'transparent',
                        border: item.diasRestantes === 0 ? '1px solid rgba(21, 101, 192, 0.2)' : 'none',
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <CakeIcon sx={{ color: '#1565c0', fontSize: 22 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {item.nombre}
                            </Typography>
                            {item.diasRestantes === 0 && (
                              <Chip label="¡HOY!" size="small" color="primary" sx={{ fontSize: 10, height: 20 }} />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', gap: 2, mt: 0.3 }}>
                            <Typography variant="caption" color="text.secondary">
                              Cumple {item.edadCumple} años
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              📅 {item.proximaFecha}
                            </Typography>
                            {item.diasRestantes > 0 && (
                              <Typography variant="caption" color="primary">
                                en {item.diasRestantes} día{item.diasRestantes !== 1 ? 's' : ''}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Próximos Aniversarios Institucionales */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CelebrationIcon sx={{ color: '#00897b' }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Próximos Aniversarios
                </Typography>
                <Chip
                  label={`${proximosAniversarios.length}`}
                  size="small"
                  color="secondary"
                  sx={{ fontWeight: 700 }}
                />
              </Box>
              <Divider sx={{ mb: 1 }} />
              {proximosAniversarios.length === 0 ? (
                <Typography variant="body2" sx={{ color: 'text.secondary', py: 3, textAlign: 'center' }}>
                  No hay aniversarios institucionales en los próximos 7 días
                </Typography>
              ) : (
                <List dense>
                  {proximosAniversarios.map((item) => (
                    <ListItem
                      key={item.id}
                      sx={{
                        borderRadius: 2,
                        mb: 0.5,
                        bgcolor: item.diasRestantes === 0 ? 'rgba(0, 137, 123, 0.08)' : 'transparent',
                        border: item.diasRestantes === 0 ? '1px solid rgba(0, 137, 123, 0.2)' : 'none',
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <BusinessIcon sx={{ color: '#00897b', fontSize: 22 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {item.nombre}
                            </Typography>
                            {item.diasRestantes === 0 && (
                              <Chip label="¡HOY!" size="small" color="secondary" sx={{ fontSize: 10, height: 20 }} />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', gap: 2, mt: 0.3 }}>
                            <Typography variant="caption" color="text.secondary">
                              Cumple {item.aniosCumple} años
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              📅 {item.proximaFecha}
                            </Typography>
                            {item.diasRestantes > 0 && (
                              <Typography variant="caption" color="secondary">
                                en {item.diasRestantes} día{item.diasRestantes !== 1 ? 's' : ''}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
