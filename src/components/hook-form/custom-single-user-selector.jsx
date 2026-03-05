import { useState, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { useGetUserDetailsTrigger } from 'src/actions/dashboard/user';

import CustomModal from 'src/components/custom-modal/custom-modal';

import UserList from 'src/sections/user/user-list';

const RHFUserSelector = ({ name, label = 'Choose user', helperText }) => {
  const { control, watch } = useFormContext();

  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const selectedUserId = watch(name);

  const { getUserDetails, userDetails, getUserDetailsLoading, getUserDetailsError } =
    useGetUserDetailsTrigger();

  // 🔁 Fetch user when value changes (select OR edit form)
  useEffect(() => {
    if (selectedUserId) {
      getUserDetails(selectedUserId);
    } else {
      setSelectedUser(null);
    }
  }, [selectedUserId, getUserDetails]);

  // 🔁 Update UI when API data arrives
  useEffect(() => {
    if (userDetails) {
      setSelectedUser(userDetails);
    }
  }, [userDetails]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box>
          {/* Button */}
          <Button
            variant="outlined"
            fullWidth
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

            <Typography>
              {selectedUser ? `${selectedUser.first_name} ${selectedUser.last_name}` : label}
            </Typography>
          </Button>

          {/* Helper / Error */}
          <Typography variant="caption" color={error ? 'error' : 'text.secondary'} sx={{ mt: 0.5 }}>
            {error?.message || helperText}
          </Typography>

          {/* Modal */}
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

                field.onChange(userId); // ✅ RHF value update
                setOpen(false);
              }}
            />
          </CustomModal>
        </Box>
      )}
    />
  );
};

export default RHFUserSelector;
