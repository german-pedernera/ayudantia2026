import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useThemeMode } from '../../contexts/ThemeContext';
import { useLocation } from 'react-router-dom';
import { DRAWER_WIDTH } from './Sidebar';

const pageTitles = {
  '/': 'Dashboard',
  '/personas': 'Personas',
  '/instituciones': 'Instituciones',
  '/calendario': 'Calendario',
  '/reportes': 'Reportes',
  '/recordatorios': 'Recordatorios',
  '/configuracion': 'Configuración',
};

const Header = ({ onMenuToggle }) => {
  const { mode, toggleTheme, isDark } = useThemeMode();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const pageTitle = pageTitles[location.pathname] || 'Ayudantia Esviacatalina';

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: isMobile ? '100%' : `calc(100% - ${DRAWER_WIDTH}px)`,
        ml: isMobile ? 0 : `${DRAWER_WIDTH}px`,
        bgcolor: isDark ? 'rgba(19, 47, 76, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary,
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
        {isMobile && (
          <IconButton
            edge="start"
            onClick={onMenuToggle}
            sx={{ mr: 2, color: theme.palette.text.primary }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          {pageTitle}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={isDark ? 'Modo claro' : 'Modo oscuro'}>
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: theme.palette.text.primary,
                bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                '&:hover': {
                  bgcolor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
                },
              }}
            >
              {isDark ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
