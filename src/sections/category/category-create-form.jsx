import { z as zod } from 'zod';
import { toast } from 'sonner';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetCategories, useCreateCategory } from 'src/actions/dashboard/category';

import { Form, Field } from 'src/components/hook-form';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

const CategoryCreateForm = ({ currentCategory }) => {
  const [searchParams] = useSearchParams();
  const parentCategoryParam = searchParams.get('parentCategory');

  // ------------------------------
  // ✅ FIXED ZOD SCHEMA
  // ------------------------------
  const CategoryCreateSchema = zod.object({
    name: zod.string().min(1, { message: 'Name is required!' }),
    slug: zod.string().min(5, { message: 'Slug is required!' }),
    parent: zod.union([zod.string(), zod.null()]).optional(),

    // Accept ANY input but validate it's a File
    image: zod.any().refine((file) => file instanceof File, {
      message: 'Image is required!',
    }),
  });

  const methods = useForm({
    resolver: zodResolver(CategoryCreateSchema),
    defaultValues: {
      name: currentCategory?.name || '',
      slug: currentCategory?.slug || '',
      parent: parentCategoryParam || '',
      image: null,
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { categories, categoriesError, categoriesIsLoading } = useGetCategories();

  useEffect(() => {
    categoriesError && toast.error(categoriesError.message || categoriesError);
  }, [categoriesError]);

  const { createCategory, createCategoryLoading, createCategoryError } = useCreateCategory();

  // ------------------------------
  // ✅ FIXED SUBMIT HANDLER (supports file upload)
  // ------------------------------
  const handleCreateCategory = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('slug', data.slug);
      formData.append('parent', data.parent || '');
      formData.append('image', data.image);

      await createCategory(formData);

      if (createCategoryError) {
        toast.error(createCategoryError.message);
      } else {
        toast.success('Category created successfully!');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="New Category"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Category', href: paths.dashboard.category.root },
          { name: 'Create' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Form methods={methods} onSubmit={handleSubmit(handleCreateCategory)} onReset={reset}>
        <Card>
          <CardHeader title="Details" subheader="Parent Category, Name, Slug" sx={{ mb: 3 }} />
          <Divider />
          <Stack spacing={3} sx={{ p: 3 }}>
            <Field.Select
              name="parent"
              label="Parent"
              slotProps={{
                select: { native: true },
                inputLabel: { shrink: true },
              }}
            >
              <option value="">-- No Parent --</option>
              <optgroup label="All Categories">
                {!categoriesIsLoading &&
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </optgroup>
            </Field.Select>

            <Field.Text name="name" label="Category Name" />
            <Field.Text name="slug" label="Slug" />

            {/* ------------------------------ */}
            {/* ✅ WORKING IMAGE UPLOAD FIELD */}
            {/* ------------------------------ */}
            <Field.Upload name="image" />
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
            loading={createCategoryLoading || isSubmitting}
          >
            {!currentCategory ? 'Create Category' : 'Save changes'}
          </LoadingButton>
        </Box>
      </Form>
    </DashboardContent>
  );
};

export default CategoryCreateForm;
