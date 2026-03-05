import PropTypes from 'prop-types';

import {
  Stack,
  Dialog,
  IconButton,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { CloseIcon } from 'src/theme/core/components/mui-x-data-grid';

export default function CustomModal({
  open,
  onClose,
  title,
  subtitle,
  children,
  actions,
  maxWidth = 'md',
  fullWidth = true,
  fullScreen = false,
  disableBackdropClick = false,
}) {
  const handleClose = (_, reason) => {
    if (disableBackdropClick && reason === 'backdropClick') return;
    onClose?.();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      fullScreen={fullScreen}
    >
      {/* HEADER */}
      {(title || subtitle) && (
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <div>
              {title && <Typography variant="h6">{title}</Typography>}
              {subtitle && (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </div>

            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
      )}

      {/* BODY */}
      <DialogContent dividers>{children}</DialogContent>

      {/* FOOTER */}
      {actions && <DialogActions sx={{ px: 3, py: 2 }}>{actions}</DialogActions>}
    </Dialog>
  );
}

CustomModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node.isRequired,
  actions: PropTypes.node,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  fullWidth: PropTypes.bool,
  fullScreen: PropTypes.bool,
  disableBackdropClick: PropTypes.bool,
};
