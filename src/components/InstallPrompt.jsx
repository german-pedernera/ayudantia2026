import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Button, Typography, IconButton, Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InstallMobileIcon from '@mui/icons-material/InstallMobile';
import CelebrationIcon from '@mui/icons-material/Celebration';
import { usePWA } from '../contexts/PWAContext';

const DISMISS_KEY = 'pwa_prompt_dismissed_at';
const DISMISS_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const InstallPrompt = () => {
  const { installable, installApp, isInstalled } = usePWA();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (installable && !isInstalled) {
      const dismissedAt = localStorage.getItem(DISMISS_KEY);
      const now = Date.now();

      if (!dismissedAt || now - parseInt(dismissedAt, 10) > DISMISS_DURATION) {
        const timer = setTimeout(() => {
          setVisible(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    } else {
      setVisible(false);
    }
  }, [installable, isInstalled]);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setVisible(false);
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
  };

  if (!visible) return null;

  return (
    <Slide in={visible} direction="up" mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          left: { xs: 16, sm: 'auto' },
          maxWidth: { sm: 400 },
          zIndex: 9999,
        }}
      >
        <Card
          sx={{
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(19, 47, 76, 0.9) 0%, rgba(13, 27, 42, 0.95) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 242, 245, 0.95) 100%)',
            backdropFilter: 'blur(16px)',
            border: (theme) =>
              `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
            boxShadow: (theme) =>
              theme.palette.mode === 'dark'
                ? '0 12px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)'
                : '0 12px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8)',
            borderRadius: 4,
            overflow: 'visible',
            position: 'relative',
          }}
        >
          <IconButton
            size="small"
            onClick={handleDismiss}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
            aria-label="Cerrar"
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          <CardContent sx={{ p: 3, pt: 3.5 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box
                sx={{
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(66, 165, 245, 0.15)' : 'rgba(21, 101, 192, 0.1)',
                  color: 'primary.main',
                  borderRadius: 3,
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 4px 12px rgba(0,0,0,0.3)'
                      : '0 4px 12px rgba(21, 101, 192, 0.15)',
                }}
              >
                <CelebrationIcon sx={{ fontSize: 28 }} />
              </Box>
              
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.5 }}>
                  Instalar Aplicación
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.4 }}>
                  Instala el Sistema de Ayudantía en tu dispositivo para acceder de manera rápida y sin conexión a Internet.
                </Typography>

                <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={handleDismiss}
                    sx={{ color: 'text.secondary' }}
                  >
                    Más tarde
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<InstallMobileIcon />}
                    onClick={handleInstall}
                    sx={{
                      background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                      color: '#ffffff',
                      boxShadow: '0 4px 14px rgba(21, 101, 192, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0d47a1 0%, #01579b 100%)',
                        boxShadow: '0 6px 18px rgba(21, 101, 192, 0.4)',
                      },
                    }}
                  >
                    Instalar
                  </Button>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Slide>
  );
};

export default InstallPrompt;
