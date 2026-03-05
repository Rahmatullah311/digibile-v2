import { mutate } from 'swr';
import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';
import getDirtyValues from 'src/utils/dirty-fields-detector';

import { endpoints } from 'src/lib/axios';
import { useUpdateUser, useDeleteUser } from 'src/actions/dashboard/user';
import { userAccountStatusArray, userAccountStatusArrayOfObjects } from 'src/global_variables';

import { Label } from 'src/components/label';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const UserEditSchema = zod.object({
  avatar: schemaHelper.file({ required: false }).nullable().optional(),
  first_name: zod.string().min(1, { message: 'First name is required!' }),
  last_name: zod.string().min(1, { message: 'Last name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  phone: schemaHelper
    .phoneNumber({ isValid: isValidPhoneNumber, required: false, nullable: true })
    .nullable()
    .optional(),
  country: zod.string().optional(),
  address: zod.string().optional(),
  state: zod.string().optional(),
  city: zod.string().optional(),
  zip_code: zod.string().optional(),
  status: zod.enum(userAccountStatusArray).optional(),
  email_verified: zod.boolean().optional(),
});

// ----------------------------------------------------------------------

export function UserEditForm({ currentUser }) {
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const hideConfirmDialog = () => {
    setConfirmDelete({ open: false, id: null });
  };
  const defaultValues = {
    status: 'active',
    avatar: null,
    email_verified: true,
    first_name: '',
    last_name: '',
    email: '',
    phone: null,
    country: '',
    state: '',
    city: '',
    address: '',
    zip_code: '',
  };

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(UserEditSchema),
    defaultValues,
    values: currentUser,
  });

  useEffect(() => {
    console.debug('currentUser', currentUser);
  }, [currentUser]);

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting, dirtyFields },
  } = methods;
  const values = watch();
  const { updateUser, updateUserError, updateUserIsLoading } = useUpdateUser(currentUser.id);
  const onSubmit = handleSubmit(async (data) => {
    const payload = getDirtyValues(dirtyFields, data);

    if (Object.keys(payload).length === 0) {
      toast.info('No changes to save');
      return;
    }

    try {
      await updateUser(payload);
      if (updateUserError) {
        toast.error(updateUser.message);
      } else {
        toast.success('User updated successfully');

        // reset dirty state but keep values
        reset(data);
        router.push(paths.dashboard.user.list);
      }
    } catch (error) {
      toast.error(error.message || 'Update failed');
    }
  });
  const { deleteUser, deleteUserError, deleteUserLoading } = useDeleteUser();
  const requestDeleteUser = (userId) => {
    setConfirmDelete({ open: true, id: userId });
  };
  const handleDeleteUser = async () => {
    try {
      await deleteUser({ id: confirmDelete.id });
      if (deleteUserError) {
        toast.error(deleteUserError.message);
      } else {
        toast.success('User deleted successfuly');
        mutate(endpoints.user.list);
        setConfirmDelete({ open: false, id: null });
        router.push(paths.dashboard.user.list);
      }
    } catch (error) {
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
          loading={deleteUserLoading}
          variant="contained"
          color="error"
          onClick={handleDeleteUser}
        >
          Delete
        </LoadingButton>
      }
    />
  );

  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ pt: 10, pb: 5, px: 3 }}>
              {currentUser && (
                <Label
                  color={
                    (values.status === 'active' && 'success') ||
                    (values.status === 'banned' && 'error') ||
                    'warning'
                  }
                  sx={{ position: 'absolute', top: 24, right: 24 }}
                >
                  {values.status}
                </Label>
              )}

              <Box sx={{ mb: 5 }}>
                <Field.UploadAvatar
                  name="avatar"
                  maxSize={3145728}
                  helperText={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 3,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.disabled',
                      }}
                    >
                      Allowed *.jpeg, *.jpg, *.png, *.gif
                      <br /> max size of {fData(3145728)}
                    </Typography>
                  }
                />
              </Box>

              {currentUser && (
                <FormControlLabel
                  labelPlacement="start"
                  control={
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          checked={field.value !== 'active'}
                          onChange={(event) =>
                            field.onChange(event.target.checked ? 'banned' : 'active')
                          }
                        />
                      )}
                    />
                  }
                  label={
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Banned
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Apply disable account
                      </Typography>
                    </>
                  }
                  sx={{
                    mx: 0,
                    mb: 3,
                    width: 1,
                    justifyContent: 'space-between',
                  }}
                />
              )}

              <Field.Switch
                name="email_verified"
                labelPlacement="start"
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Email verified
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Disabling this will automatically send the user a verification email
                    </Typography>
                  </>
                }
                sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
              />

              {currentUser && (
                <Stack sx={{ mt: 3, alignItems: 'center', justifyContent: 'center' }}>
                  <Button
                    variant="soft"
                    color="error"
                    onClick={() => {
                      requestDeleteUser(currentUser.id);
                    }}
                  >
                    Delete user
                  </Button>
                </Stack>
              )}
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ p: 3 }}>
              <Box
                sx={{
                  rowGap: 3,
                  columnGap: 2,
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <Field.Text name="first_name" label="First name" />
                <Field.Text name="last_name" label="Last name" />
                <Field.Text name="email" label="Email address" />
                <Field.Phone name="phone" label="Phone number" defaultCountry="US" />

                <Field.CountrySelect
                  fullWidth
                  name="country"
                  label="Country"
                  placeholder="Choose a country"
                />

                <Field.Text name="state" label="State/region" />
                <Field.Text name="city" label="City" />
                <Field.Text name="address" label="Address" />
                <Field.Text name="zip_code" label="Zip/code" />
                <Field.Select name="status" label="Status">
                  {userAccountStatusArrayOfObjects.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Field.Select>
              </Box>

              <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting || updateUserIsLoading}
                >
                  Save changes
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
      {renderConfirmDialog()}
    </>
  );
}
