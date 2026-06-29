import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Avatar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import CelebrationIcon from '@mui/icons-material/Celebration';
import InstallMobileIcon from '@mui/icons-material/InstallMobile';
import AlarmIcon from '@mui/icons-material/Alarm';
import { useAuth } from '../../contexts/AuthContext';
import { usePWA } from '../../contexts/PWAContext';

const DRAWER_WIDTH = 270;
const ADMIN_USER = 'Ger25$';

const allMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Personas', icon: <PeopleIcon />, path: '/personas' },
  { text: 'Instituciones', icon: <BusinessIcon />, path: '/instituciones' },
  { text: 'Calendario', icon: <CalendarMonthIcon />, path: '/calendario' },
  { text: 'Reportes', icon: <AssessmentIcon />, path: '/reportes' },
  { text: 'Recordatorios', icon: <AlarmIcon />, path: '/recordatorios' },
  { text: 'Configuración', icon: <SettingsIcon />, path: '/configuracion', adminOnly: true },
];

const Sidebar = ({ open, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { installable, installApp } = usePWA();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isAdmin = user?.username === ADMIN_USER;
  const menuItems = allMenuItems.filter((item) => !item.adminOnly || isAdmin);

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) onClose();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo / Brand */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Avatar
          sx={{
            bgcolor: 'rgba(255,255,255,0.2)',
            width: 44,
            height: 44,
          }}
        >
          <CelebrationIcon sx={{ fontSize: 26 }} />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
            Ayudantia
          </Typography>
          <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.2 }}>
            Esviacatalina
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mx: 2 }} />

      {/* User Info */}
      <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar
          sx={{
            bgcolor: 'rgba(255,255,255,0.15)',
            width: 36,
            height: 36,
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {user?.username?.charAt(0)?.toUpperCase() || 'U'}
        </Avatar>
        <Box>
          <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
            {user?.username || 'Usuario'}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Administrador
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mx: 2 }} />

      {/* Menu Items */}
      <List sx={{ px: 1.5, py: 1, flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 2,
                  bgcolor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                  '&:hover': {
                    bgcolor: isActive
                      ? 'rgba(255,255,255,0.2)'
                      : 'rgba(255,255,255,0.08)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                  }}
                />
                {isActive && (
                  <Box
                    sx={{
                      width: 4,
                      height: 24,
                      borderRadius: 2,
                      bgcolor: '#fff',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Install App */}
      {installable && (
        <>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mx: 2 }} />
          <List sx={{ px: 1.5, py: 1 }}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={installApp}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 2,
                  background: 'rgba(255, 255, 255, 0.08)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.15)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>
                  <InstallMobileIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Instalar App"
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#fff',
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </>
      )}

      {/* Logout */}
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mx: 2 }} />
      <List sx={{ px: 1.5, py: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              py: 1.2,
              px: 2,
              '&:hover': {
                bgcolor: 'rgba(239,83,80,0.15)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'rgba(255,255,255,0.6)', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Cerrar Sesión"
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.7)',
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={open}
          onClose={onClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export { DRAWER_WIDTH };
export default Sidebar;
