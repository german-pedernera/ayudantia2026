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
        background: 'linear-gradient(rgba(0, 10, 30, 0.7), rgba(0, 10, 30, 0.8)), url("https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop") no-repeat center center',
        backgroundSize: 'cover',
        p: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Card
        elevation={0}
        sx={{
          maxWidth: 420,
          width: '100%',
          borderRadius: 4,
          overflow: 'visible',
          position: 'relative',
          bgcolor: 'rgba(15, 25, 45, 0.6)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
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
            <Typography component="h1" variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 1, textAlign: 'center' }}>
              Ayudantia Esviacatalina
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>
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
              sx={{ 
                mb: 2.5,
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  bgcolor: 'rgba(0,0,0,0.2)',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                  '&.Mui-focused fieldset': { borderColor: '#fff' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#fff' },
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 1000px rgba(15, 25, 45, 0.8) inset',
                  WebkitTextFillColor: '#fff',
                }
              }}
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
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  bgcolor: 'rgba(0,0,0,0.2)',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                  '&.Mui-focused fieldset': { borderColor: '#fff' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#fff' },
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 1000px rgba(15, 25, 45, 0.8) inset',
                  WebkitTextFillColor: '#fff',
                }
              }}
              autoComplete="current-password"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: 'rgba(255,255,255,0.7)' }}
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
