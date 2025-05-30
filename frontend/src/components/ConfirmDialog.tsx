import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  Box
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import { ConfirmDialogProps } from '../types';

/**
 * ConfirmDialog component for user confirmations
 * Features Material-UI design and customizable content
 */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <WarningIcon color="warning" />
          {title}
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 1 }}>
        <DialogContentText>
          {message}
        </DialogContentText>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button 
          onClick={onCancel}
          color="inherit"
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm}
          variant="contained"
          color="error"
          autoFocus
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog; 