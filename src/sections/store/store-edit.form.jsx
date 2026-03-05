import { toast } from 'sonner';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import MenuItem from '@mui/material/MenuItem';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

import { useUpdateStore, useGetStoreDetails } from 'src/actions/dashboard/store';

import { Form, Field } from 'src/components/hook-form';
import { RHFUploadBanner } from 'src/components/hook-form/rhf-banner-upload';
import RHFUserSelector from 'src/components/hook-form/custom-single-user-selector';

import { StoreCreateSchema, STORE_STATUS_OPTIONS, StoreCreateInitialValues } from './constants';

const StoreEditForm = () => {
  const router = useRouter();
  const { id } = useParams();

  const { storeDetails, storeDetailsError, storeDetailsLoading } = useGetStoreDetails(id);

  const { updateStore, updateStoreLoading } = useUpdateStore(id);

  const methods = useForm({
    resolver: zodResolver(StoreCreateSchema),
    defaultValues: StoreCreateInitialValues(),
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, dirtyFields },
    getValues,
  } = methods;

  // ✅ Reset form when data arrives
  useEffect(() => {
    if (storeDetails) {
      reset(StoreCreateInitialValues(storeDetails));
    }
  }, [storeDetails, reset]);

  // ✅ Error handling
  useEffect(() => {
    if (storeDetailsError) {
      toast.error(storeDetailsError.message);
    }
  }, [storeDetailsError]);

  // ✅ Submit handler
  const handleEditStoreSubmit = async () => {
    try {
      const values = getValues();

      // Build payload with only dirty fields
      const payload = Object.keys(dirtyFields).reduce((acc, key) => {
        acc[key] = values[key];
        return acc;
      }, {});

      // If nothing changed, prevent request
      if (Object.keys(payload).length === 0) {
        toast.info('No changes detected');
        return;
      }

      await updateStore(payload);

      toast.success('Store updated successfully');
      router.push(paths.dashboard.store.list);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Form methods={methods} onSubmit={handleSubmit(handleEditStoreSubmit)}>
      <Box>
        <Stack spacing={3} sx={{ p: 3 }}>
          {/* MEDIA */}
          <Card>
            <CardHeader title="Store Media" subheader="Logo and banner" />
            <CardContent>
              <Stack direction="row" spacing={3}>
                <Field.UploadAvatar name="logo" label="Logo" defaultValue={storeDetails?.logo} />
                <RHFUploadBanner
                  name="banner"
                  helperText="Upload banner image (1200×400 recommended)"
                />
              </Stack>
            </CardContent>
          </Card>

          {/* OWNERSHIP */}
          <Card>
            <CardHeader
              title="Store ownership details"
              subheader="Owner, name, slug and description"
            />
            <CardContent>
              <Stack spacing={3}>
                <RHFUserSelector name="owner_id" label="Choose a user" />
                <Field.Text name="name" label="Name" />
                <Field.Text name="slug" label="Slug" />
                <Field.Editor name="description" label="Description" />
              </Stack>
            </CardContent>
          </Card>

          {/* CONTACT */}
          <Card>
            <CardHeader title="Store contact details" />
            <CardContent>
              <Stack spacing={3}>
                <Stack direction="row" spacing={2}>
                  <Field.Text name="email" label="Email" />
                  <Field.Checkbox name="email_verified" label="Verified" />
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Field.Text name="phone" label="Phone" />
                  <Field.Checkbox name="phone_verified" label="Verified" />
                </Stack>
                <Field.Text name="website" label="Website" />
                <Field.Text name="address" label="Address" />
              </Stack>
            </CardContent>
          </Card>

          {/* SOCIAL */}
          <Card>
            <CardHeader title="Store social details" />
            <CardContent>
              <Stack spacing={3}>
                <Field.Text name="facebook" label="Facebook" />
                <Field.Text name="twitter" label="Twitter" />
                <Field.Text name="instagram" label="Instagram" />
              </Stack>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader title="Store SEO details" />
            <CardContent>
              <Stack spacing={3}>
                <Field.Text name="seo_title" label="SEO Title" />
                <Field.Editor name="seo_description" label="SEO Description" />
              </Stack>
            </CardContent>
          </Card>

          {/* STATUS */}
          <Card>
            <CardHeader title="Store activity status" />
            <CardContent>
              <Stack spacing={3}>
                <Field.Select name="status" label="Status">
                  {STORE_STATUS_OPTIONS.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Field.Select>

                <Field.Checkbox name="verified" label="Verified" />
              </Stack>
            </CardContent>
          </Card>

          {/* SUBMIT */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              loading={updateStoreLoading || isSubmitting}
            >
              Update Store
            </LoadingButton>
          </Box>
        </Stack>
      </Box>
    </Form>
  );
};

export default StoreEditForm;
