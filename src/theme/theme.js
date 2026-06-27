import { createTheme } from '@mui/material/styles';

const commonTypography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  h4: { fontWeight: 700 },
  h5: { fontWeight: 700 },
  h6: { fontWeight: 600 },
  subtitle1: { fontWeight: 500 },
  button: { fontWeight: 600, textTransform: 'none' },
};

const commonComponents = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 10,
        padding: '8px 20px',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 12,
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 10,
        },
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      head: {
        fontWeight: 700,
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRight: 'none',
      },
    },
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1565c0',
      light: '#5e92f3',
      dark: '#003c8f',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00897b',
      light: '#4ebaaa',
      dark: '#005b4f',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f0f2f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a2e',
      secondary: '#546e7a',
    },
    persona: {
      main: '#2196f3',
      light: '#64b5f6',
    },
    institucion: {
      main: '#4caf50',
      light: '#81c784',
    },
    error: {
      main: '#e53935',
    },
    warning: {
      main: '#ff9800',
    },
    success: {
      main: '#4caf50',
    },
    info: {
      main: '#2196f3',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  typography: commonTypography,
  components: {
    ...commonComponents,
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          background: 'linear-gradient(195deg, #1a237e 0%, #0d47a1 50%, #01579b 100%)',
          color: '#ffffff',
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#42a5f5',
      light: '#80d6ff',
      dark: '#0077c2',
      contrastText: '#000000',
    },
    secondary: {
      main: '#4db6ac',
      light: '#82e9de',
      dark: '#00867d',
      contrastText: '#000000',
    },
    background: {
      default: '#0a1929',
      paper: '#132f4c',
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#90a4ae',
    },
    persona: {
      main: '#64b5f6',
      light: '#90caf9',
    },
    institucion: {
      main: '#81c784',
      light: '#a5d6a7',
    },
    error: {
      main: '#ef5350',
    },
    warning: {
      main: '#ffa726',
    },
    success: {
      main: '#66bb6a',
    },
    info: {
      main: '#42a5f5',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
  },
  typography: commonTypography,
  components: {
    ...commonComponents,
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          background: 'linear-gradient(195deg, #0d1b2a 0%, #1b2838 50%, #172a3a 100%)',
          color: '#ffffff',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
          backgroundImage: 'none',
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
});
