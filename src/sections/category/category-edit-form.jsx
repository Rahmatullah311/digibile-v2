import { z as zod } from 'zod';
import { toast } from 'sonner';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetCategories, useUpdateCategory } from 'src/actions/dashboard/category';

import { Form, Field } from 'src/components/hook-form';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

const CategoryEditForm = ({ currentCategory }) => {
  const CategoryEditSchema = zod.object({
    name: zod.string().min(1, { message: 'Name is required!' }),
    slug: zod.string().min(5, { message: 'Slug is required!' }),
    parent: zod.union([zod.number(), zod.null()]).optional(),
    image: zod.any(),
  });

  const methods = useForm({
    resolver: zodResolver(CategoryEditSchema),
    defaultValues: {
      name: currentCategory?.name || '',
      slug: currentCategory?.slug || '',
      parent: currentCategory?.parent || '',
      image: currentCategory?.image_url || '',
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

  const { updateCategory, updateCategoryError, updateCategoryLoading } = useUpdateCategory();

  const handleUpdateCategory = async (data) => {
    try {
      const payload = new FormData();
      payload.append('parent', data.parent);
      payload.append('name', data.name);
      payload.append('slug', data.slug);
      if (data.image instanceof File) {
        payload.append('image', data.image);
      }
      console.debug('payload', payload);
      await updateCategory({ categoryId: currentCategory.id, payload });

      updateCategoryError
        ? toast.error(updateCategoryError.message)
        : toast.success('Category updated successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Category"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Category', href: paths.dashboard.category.root },
          { name: 'Edit' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Form methods={methods} onSubmit={handleSubmit(handleUpdateCategory)} onReset={reset}>
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
                    <option key={category.id} value={String(category.id)}>
                      {category.name}
                    </option>
                  ))}
              </optgroup>
            </Field.Select>

            <Field.Text name="name" label="Category Name" />
            <Field.Text name="slug" label="Slug" />
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
            loading={updateCategoryLoading || isSubmitting}
          >
            Save changes
          </LoadingButton>
        </Box>
      </Form>
    </DashboardContent>
  );
};

export default CategoryEditForm;
