import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import { useRouter } from 'src/routes/hooks';

import getDirtyValues from 'src/utils/dirty-fields-detector';

import { useUpdateAddress, useCreateUserAddress } from 'src/actions/dashboard/user';

import { Form, Field, schemaHelper } from 'src/components/hook-form';
// ----------------------------------------------------------------------
// Zod Schema based on your API
export const AddressCreateSchema = zod.object({
  title: zod.string().min(1).max(20, { message: 'Title must be max 20 characters' }),
  reciever_name: zod.string().min(1).max(255),
  phone: schemaHelper.phoneNumber({ isValid: isValidPhoneNumber }),
  address_type: zod.enum(['shipping', 'billing']), // Based on your API enum
  address_line1: zod.string().min(1).max(255),
  address_line2: zod.string().max(255).nullable(),
  street: zod.string().min(1).max(255),
  city: zod.string().min(1).max(100),
  state: zod.string().min(1).max(100),
  postal_code: zod.string().min(1).max(20),
  country: zod.string().min(1).max(50),
  latitude: zod.string().nullable(),
  longitude: zod.string().nullable(),
  is_default: zod.boolean(),
});

// ----------------------------------------------------------------------

export function AddressEditForm({ currentAddress }) {
  const { id } = useParams();

  const router = useRouter();
  const defaultValues = {
    title: '',
    reciever_name: '',
    phone: '',
    address_type: 'shipping',
    address_line1: '',
    address_line2: '',
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    latitude: '',
    longitude: '',
    is_default: true,
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(AddressCreateSchema),
    defaultValues,
    values: currentAddress,
  });

  const {
    handleSubmit,
    formState: { isSubmitting, dirtyFields },
  } = methods;

  const { createAddress, createAddressError, createAddressIsLoading } = useCreateUserAddress();
  const { updateAddress, updateAddressError, updateAddressIsLoading } = useUpdateAddress(
    currentAddress.id
  );
  const onSubmit = handleSubmit(async (data) => {
    const payload = getDirtyValues(dirtyFields, data);

    await updateAddress(payload, {
      onSuccess: () => {
        toast.success('Address updated successfully');
        // router.push(`${paths.dashboard.user.address.list(id)}`);
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to update address');
      },
    });
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card sx={{ mb: 2 }}>
        <CardHeader title="New Address" subheader="Create a new address" />
        <CardContent dividers>
          <Stack spacing={3}>
            {/* Address Type */}
            <Field.RadioGroup
              row
              name="address_type"
              options={[
                { label: 'Shipping', value: 'shipping' },
                { label: 'Billing', value: 'billing' },
              ]}
            />

            {/* Basic Info */}
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Text name="title" label="Title" />
              <Field.Text name="reciever_name" label="Receiver Name" />
            </Box>

            <Field.Phone name="phone" label="Phone Number" defaultCountry="US" />

            {/* Address Lines */}
            <Field.Text name="address_line1" label="Address Line 1" />
            <Field.Text name="address_line2" label="Address Line 2 (optional)" />

            <Field.Text name="street" label="Street" />

            {/* City/State/Postal */}
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' },
              }}
            >
              <Field.Text name="city" label="City" />
              <Field.Text name="state" label="State" />
              <Field.Text name="postal_code" label="Postal Code" />
            </Box>

            {/* Country */}
            <Field.CountrySelect name="country" label="Country" placeholder="Choose a country" />

            {/* Optional Coordinates */}
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Text name="latitude" label="Latitude (optional)" />
              <Field.Text name="longitude" label="Longitude (optional)" />
            </Box>

            <Field.Checkbox name="is_default" label="Set as default address" />
          </Stack>
        </CardContent>
      </Card>
      <Box
        component="div"
        sx={{
          gap: 3,
          mt: 3,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'end',
        }}
      >
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={createAddressIsLoading || isSubmitting}
        >
          Add
        </LoadingButton>
      </Box>
    </Form>
  );
}
