import { Box, Card, CardContent, Typography, Alert, Grid, Button } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import TelegramIcon from '@mui/icons-material/Telegram';
import BarChartIcon from '@mui/icons-material/BarChart';
import StorageIcon from '@mui/icons-material/Storage';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

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

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <BarChartIcon color="secondary" />
            Panel de Monitoreo y Facturación
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Firebase no permite visualizar directamente los gastos o el almacenamiento exacto en tiempo real por razones de seguridad. 
            Utilice los siguientes accesos directos para ir a las consolas oficiales de su proyecto y ver las estadísticas y costos.
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                startIcon={<StorageIcon />}
                endIcon={<OpenInNewIcon />}
                href="https://console.firebase.google.com/project/agenda2026-13cbf/firestore/usage"
                target="_blank"
                sx={{ height: '100%', py: 1.5 }}
              >
                Uso de Base de Datos
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                startIcon={<BarChartIcon />}
                endIcon={<OpenInNewIcon />}
                href="https://console.firebase.google.com/project/agenda2026-13cbf/functions/list"
                target="_blank"
                sx={{ height: '100%', py: 1.5 }}
              >
                Uso de Funciones
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="outlined"
                color="success"
                fullWidth
                startIcon={<MonetizationOnIcon />}
                endIcon={<OpenInNewIcon />}
                href="https://console.firebase.google.com/project/agenda2026-13cbf/usage/details"
                target="_blank"
                sx={{ height: '100%', py: 1.5 }}
              >
                Gastos y Facturación
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Configuracion;
