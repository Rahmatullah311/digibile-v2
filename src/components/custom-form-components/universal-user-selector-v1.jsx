import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetUserDetailsTrigger } from 'src/actions/dashboard/user';

import CustomModal from 'src/components/custom-modal/custom-modal';

import UserList from 'src/sections/user/user-list';

const UserSelector = ({
  value,
  onChange,
  label = 'Choose user',
  helperText,
  error,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { getUserDetails, userDetails, getUserDetailsLoading, getUserDetailsError } =
    useGetUserDetailsTrigger();

  // Fetch user when value changes
  useEffect(() => {
    console.debug('value', value);
    if (value) {
      getUserDetails(value);
    } else {
      setSelectedUser(null);
    }
  }, [value, getUserDetails]);

  // Update UI when data arrives
  useEffect(() => {
    if (userDetails) {
      setSelectedUser(userDetails);
    }
  }, [userDetails]);

  return (
    <Box>
      <Button
        variant="outlined"
        fullWidth
        disabled={disabled}
        onClick={() => setOpen(true)}
        sx={{
          justifyContent: 'flex-start',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          padding: 1,
        }}
        color={error ? 'error' : 'inherit'}
      >
        {getUserDetailsLoading ? (
          <CircularProgress size={20} />
        ) : (
          <Avatar
            src={selectedUser?.avatar_thumbnail || undefined}
            alt={
              selectedUser
                ? `${selectedUser.first_name} ${selectedUser.last_name}`
                : 'No user selected'
            }
            sx={{ width: 32, height: 32 }}
          >
            {selectedUser?.first_name?.[0] || '?'}
          </Avatar>
        )}

        <Typography>
          {selectedUser ? `${selectedUser.first_name} ${selectedUser.last_name}` : label}
        </Typography>
      </Button>

      <Typography variant="caption" color={error ? 'error' : 'text.secondary'} sx={{ mt: 0.5 }}>
        {getUserDetailsError?.message || helperText}
      </Typography>

      <CustomModal
        open={open}
        onClose={() => setOpen(false)}
        title="Select user"
        subtitle="You can only choose one user"
      >
        <UserList
          rowSelection
          disableMultipleRowSelection
          onRowSelectionModelChange={(model) => {
            const userId = Array.from(model.ids)[0];
            if (!userId) return;

            onChange?.(userId); // ✅ Pure change handler
            setOpen(false);
          }}
        />
      </CustomModal>
    </Box>
  );
};

export default UserSelector;
