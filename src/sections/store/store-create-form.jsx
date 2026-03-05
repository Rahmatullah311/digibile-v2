import React from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useCreateStore } from 'src/actions/dashboard/store';

import { Form, Field } from 'src/components/hook-form';
import { RHFUploadBanner } from 'src/components/hook-form/rhf-banner-upload';
import RHFUserSelector from 'src/components/hook-form/custom-single-user-selector';

import { StoreCreateSchema, STORE_STATUS_OPTIONS, StoreCreateInitialValues } from './constants';

const StoreCreateForm = () => {
  const router = useRouter();
  const methods = useForm({
    resolver: zodResolver(StoreCreateSchema),
    defaultValues: StoreCreateInitialValues(),
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { createStore, createStoreLoading } = useCreateStore();
  const handleCreateStoreFormSubmit = (data) => {
    try {
      createStore(data, {
        onSuccess: () => {
          toast.success('Store created successfuly');
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });
      reset();
      router.push(paths.dashboard.store.list);
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <Form methods={methods} onReset={reset} onSubmit={handleSubmit(handleCreateStoreFormSubmit)}>
      <Box>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Card>
            <CardHeader title="Store Media" subheader="Logo, Banner" />

            <CardContent>
              <Stack direction="row" spacing={3} sx={{ p: 3 }}>
                <Field.UploadAvatar name="logo" label="Logo" />
                <RHFUploadBanner
                  name="banner"
                  helperText="Upload banner image (1200×400 recommended)"
                />
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title="Store ownership details"
              subheader="Owner, Name, Slug, Descriptions"
            />

            <CardContent>
              <Stack spacing={3} sx={{ p: 3 }}>
                <RHFUserSelector name="owner_id" label="Choose a user" />
                <Field.Text name="name" label="Name" />
                <Field.Text name="slug" label="Slug" />
                <Field.Editor name="description" label="Descriptions" />
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Store contact details" subheader="Email, Phone, Website, Address" />

            <CardContent>
              <Stack spacing={3} sx={{ p: 3 }}>
                <Stack direction="row">
                  <Field.Text name="email" label="Email" />
                  <Field.Checkbox name="email_verified" label="Verified" />
                </Stack>
                <Stack direction="row">
                  <Field.Text name="phone" label="Phone" />
                  <Field.Checkbox name="phone_verified" label="Verified" />
                </Stack>
                <Field.Text name="website" label="Website" />
                <Field.Text name="address" label="Address" />
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Store social details" subheader="Facebook, Twitter, Instagram" />

            <CardContent>
              <Stack spacing={3} sx={{ p: 3 }}>
                <Field.Text name="facebook" label="Facebook" />
                <Field.Text name="twitter" label="Twitter" />
                <Field.Text name="instagram" label="Instagram" />
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Store SEO details" subheader="Title, Descriptions" />

            <CardContent>
              <Stack spacing={3} sx={{ p: 3 }}>
                <Field.Text name="seo_title" label="SEO Title" />
                <Field.Editor name="seo_description" label="SEO Descriptions" />
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Store activity status" subheader="Status, Verification" />

            <CardContent>
              <Stack spacing={3} sx={{ p: 3 }}>
                <Field.Select name="seo_title" label="Status">
                  {STORE_STATUS_OPTIONS.map((item) => (
                    <option value={item.label}>{item.value}</option>
                  ))}
                </Field.Select>
                <Field.Checkbox name="verified" label="Verified" />
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
              loading={createStoreLoading || isSubmitting}
            >
              Submit
            </LoadingButton>
          </Box>
        </Stack>
      </Box>
    </Form>
  );
};

export default StoreCreateForm;
