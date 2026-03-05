import { toast } from 'sonner';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { useCreateUser } from 'src/actions/dashboard/user';
import { userAccountStatusArray, userAccountStatusArrayOfObjects } from 'src/global_variables';

import { Label } from 'src/components/label';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const UserCreateSchema = zod
  .object({
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
    isVerified: zod.boolean().optional(),
    password: zod.string().min(8, { message: 'Password must be at least 8 characters!' }),
    password2: zod.string().min(8, { message: 'Confirm password is required!' }),
  })
  .refine((data) => data.password === data.password2, {
    message: 'Passwords do not match!',
    path: ['password2'], // 👈 error shows under confirm password field
  });

// ----------------------------------------------------------------------

export function UserCreateForm({ currentUser }) {
  const router = useRouter();

  const defaultValues = {
    status: 'active',
    avatar: null,
    isVerified: true,
    first_name: '',
    last_name: '',
    email: '',
    phone: null,
    country: '',
    state: '',
    city: '',
    address: '',
    zip_code: '',
    password: '',
    password2: '',
  };

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(UserCreateSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  const { createUser, createUserLoading } = useCreateUser();
  const onSubmit = handleSubmit(async (data) => {
    try {
      createUser(data, {
        onSuccess: () => {
          reset();
          toast.success(currentUser ? 'Update success!' : 'Create success!');
          router.push(paths.dashboard.user.list);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });
    } catch (error) {
      console.error(error);
    }
  });

  return (
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
              name="isVerified"
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
                <Button variant="soft" color="error">
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
              <Field.Text name="password" label="Password" type="password" />

              <Field.Text name="password2" label="Confirm password" type="password" />
            </Box>

            <Stack sx={{ mt: 3, alignItems: 'flex-end' }}>
              <Button type="submit" variant="contained" loading={createUserLoading || isSubmitting}>
                {!currentUser ? 'Create user' : 'Save changes'}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
