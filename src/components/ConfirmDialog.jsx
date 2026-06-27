import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const ConfirmDialog = ({ open, title, message, onConfirm, onCancel }) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        sx: {
          borderRadius: 3,
          minWidth: 360,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontWeight: 700,
        }}
      >
        <WarningAmberIcon color="warning" />
        {title || 'Confirmar acción'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {message || '¿Está seguro que desea realizar esta acción?'}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} variant="outlined" color="inherit">
          Cancelar
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error" autoFocus>
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
