import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Avatar,
  CircularProgress,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CelebrationIcon from '@mui/icons-material/Celebration';
import LoginIcon from '@mui/icons-material/Login';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Ingrese usuario y contraseña');
      return;
    }

    setLoading(true);
    try {
      await login(username.trim(), password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0d47a1 0%, #1a237e 25%, #283593 50%, #1565c0 75%, #01579b 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        '@keyframes gradientShift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        p: 2,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'float 20s linear infinite',
        },
        '@keyframes float': {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(50px, 50px)' },
        },
      }}
    >
      <Card
        elevation={24}
        sx={{
          maxWidth: 420,
          width: '100%',
          borderRadius: 4,
          overflow: 'visible',
          position: 'relative',
          bgcolor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Avatar
              sx={{
                width: 72,
                height: 72,
                bgcolor: '#1a237e',
                mb: 2,
                boxShadow: '0 8px 32px rgba(26, 35, 126, 0.3)',
              }}
            >
              <CelebrationIcon sx={{ fontSize: 38, color: '#fff' }} />
            </Avatar>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, color: '#1a237e', textAlign: 'center' }}
            >
              Sistema de Aniversarios
            </Typography>
            <Typography variant="body2" sx={{ color: '#546e7a', mt: 0.5 }}>
              Ingrese sus credenciales para acceder
            </Typography>
          </Box>

          {/* Error */}
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: 2 }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              id="login-username"
              label="Usuario"
              placeholder="Ej. Ger25$"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 2.5 }}
              autoFocus
              autoComplete="username"
            />

            <TextField
              id="login-password"
              label="Contraseña"
              placeholder="Ingrese su contraseña"
              fullWidth
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
              autoComplete="current-password"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        color="primary"
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              }}
            />

            <Button
              id="login-submit"
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
              sx={{
                py: 1.5,
                fontSize: 16,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #1a237e 0%, #1565c0 100%)',
                boxShadow: '0 4px 20px rgba(21, 101, 192, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)',
                  boxShadow: '0 6px 24px rgba(21, 101, 192, 0.5)',
                },
              }}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
