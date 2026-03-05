import { toast } from 'sonner';
import { useState } from 'react';
import { Link, useParams } from 'react-router';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';

import {
  useDeleteAddress,
  useGetUserAddresses,
  useChangeDefaultAddress,
} from 'src/actions/dashboard/user';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

export function AddressItem({ address, action, sx, ...other }) {
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const { id } = useParams();
  const hideConfirmDialog = () => {
    setConfirmDelete({ open: false, id: null });
  };
  const { deleteAddress, deleteAddressError, deleteAddressIsLoading } = useDeleteAddress(
    confirmDelete.id
  );
  const { addresses, addressesError, addressesIsLoading, mutateAddresses } =
    useGetUserAddresses(id);

  const { changeDefaultAddress, changeDefaultAddressError, changeDefaultAddressLoading } =
    useChangeDefaultAddress();

  const handleChangeDefaultAddress = async () => {
    try {
      await changeDefaultAddress(
        {
          userId: id,
          addressId: address.id,
        },
        {
          onSuccess: () => {
            toast.success('Default address changed successfully');
            mutateAddresses();
          },
          onError: (error) => {
            toast.error(error.message);
          },
        }
      );
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
    }
  };

  const requestDeleteAddress = (userId) => {
    setConfirmDelete({ open: true, id: userId });
  };
  const handleDeleteAddress = async () => {
    try {
      const result = await deleteAddress(confirmDelete.id, {
        onSuccess: () => {
          toast.success('Address deleted successfuly');
          hideConfirmDialog();
          mutateAddresses();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });
      console.debug('result', result);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDelete.open}
      onClose={hideConfirmDialog}
      title="Delete Category"
      content="Are you sure want to delete?"
      action={
        <LoadingButton
          loading={deleteAddressIsLoading}
          variant="contained"
          color="error"
          onClick={handleDeleteAddress}
        >
          Delete
        </LoadingButton>
      }
    />
  );

  return (
    <>
      <Paper
        sx={[
          {
            p: 2.5,
            gap: 2,
            display: 'flex',
            position: 'relative',
            borderRadius: 2,
            alignItems: { md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        {/* Left content */}
        <Box sx={{ flex: '1 1 auto', width: '100%' }}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1,
              gap: 2,
            }}
          >
            {/* Header Left */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
              <Iconify icon="solar:map-point-bold" width={20} />

              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {address.title}
              </Typography>

              <Label variant="soft" color={address.address_type === 'Home' ? 'success' : 'warning'}>
                {address.address_type}
              </Label>

              {address.is_default && (
                <Label color="info" variant="filled">
                  Default
                </Label>
              )}
            </Box>

            <Box>
              <Stack direction="row" spacing={1}>
                {!address.is_default && (
                  <Tooltip title="Use this address as default" variant="outlined">
                    <LoadingButton
                      color="primary"
                      onClick={handleChangeDefaultAddress}
                      loading={changeDefaultAddressLoading}
                    >
                      Make default
                    </LoadingButton>
                  </Tooltip>
                )}
                <Tooltip title="Delete this address">
                  <IconButton color="error" onClick={() => requestDeleteAddress(address.id)}>
                    <Iconify icon="mdi:delete-outline" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Edit this address">
                  <IconButton
                    component={Link}
                    to={paths.dashboard.user.address.edit(id, address.id)}
                    color="primary"
                  >
                    <Iconify icon="mdi:pencil-outline" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>
          </Box>

          <Divider sx={{ mb: 1.5 }} />

          {/* Address */}
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <Iconify icon="solar:home-2-bold" width={18} />
            <Box>
              <Typography variant="body2">{address.address_line1}</Typography>

              {address.address_line2 && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {address.address_line2}
                </Typography>
              )}

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {address.street}, {address.city}, {address.state}
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {address.postal_code}, {address.country}
              </Typography>
            </Box>
          </Box>

          {/* Recipient */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Iconify icon="solar:user-bold" width={18} />
            <Box>
              <Typography variant="body2">{address.reciever_name}</Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {address.phone}
              </Typography>

              {address.user_email && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {address.user_email}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>
      {renderConfirmDialog()}
    </>
  );
}
