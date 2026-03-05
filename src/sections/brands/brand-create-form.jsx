import React from 'react';
import { mutate } from 'swr';
import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';

import { paths } from 'src/routes/paths';

import { endpoints } from 'src/lib/axios';
import { DashboardContent } from 'src/layouts/dashboard';
import { useCreateBrand } from 'src/actions/dashboard/brand';

import { Form, Field } from 'src/components/hook-form';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

const BrandCreateForm = () => {
  const BrandCreateSchema = zod.object({
    name: zod.string().min(1, { message: 'Name is required' }),
    slug: zod.string().min(3, { message: 'Slug is required' }),
    logo: zod.any().refine((file) => file instanceof File, {
      message: 'Logo is required',
    }),
  });
  const methods = useForm({
    resolver: zodResolver(BrandCreateSchema),
    defaultValues: {
      name: '',
      slug: '',
      logo: null,
    },
  });

  const { createBrand, createBrandError, createBrandLoading } = useCreateBrand();
  const handleSubmitBrandForm = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('slug', data.slug);
      formData.append('logo', data.logo);
      await createBrand(formData);
      if (createBrandError) {
        toast.error(createBrandError.message);
      } else {
        toast.success('Brand created successfully!');
        mutate(endpoints.brand.list);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="New Brand"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Brands', href: paths.dashboard.brand.root },
          { name: 'New' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Form methods={methods} onReset={reset} onSubmit={handleSubmit(handleSubmitBrandForm)}>
        <Card>
          <CardHeader title="Details" subheader="Nane, Slug" sx={{ mb: 3 }} />
          <Divider />

          <Stack spacing={3} sx={{ p: 3 }}>
            <Field.Text name="name" label="Brand Name" />
            <Field.Text name="slug" label="Brand Slug" />
            <Field.Upload name="logo" />
          </Stack>
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
            loading={createBrandLoading || isSubmitting}
          >
            Save changes
          </LoadingButton>
        </Box>
      </Form>
    </DashboardContent>
  );
};

export default BrandCreateForm;
