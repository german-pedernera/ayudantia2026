import { Box, Card, CardContent, Typography, Alert } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import TelegramIcon from '@mui/icons-material/Telegram';

const Configuracion = () => {
  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <TelegramIcon color="primary" />
            Configuración de Telegram
          </Typography>

          <Alert 
            icon={<InfoIcon />} 
            severity="info"
            sx={{
              '& .MuiAlert-message': { width: '100%' },
              borderRadius: 2
            }}
          >
            Las notificaciones automáticas se envían diariamente a las 08:00 AM mediante Firebase Cloud Functions. 
            Asegúrese de tener el plan Blaze activado y las Cloud Functions desplegadas.
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Configuracion;
