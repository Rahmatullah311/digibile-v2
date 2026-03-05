import React from 'react';

import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import StoreEditForm from '../store-edit.form';

const StoreEditView = () => (
  <DashboardContent>
    <CustomBreadcrumbs
      heading="List"
      links={[
        { name: 'Dashboard', href: paths.dashboard.root },
        { name: 'Stores', href: paths.dashboard.store.list },
        { name: 'Edit' },
      ]}
      action={
        <Button
          component={RouterLink}
          href={paths.dashboard.store.list}
          variant="contained"
          startIcon={<Iconify icon="mingcute:close-line" />}
        >
          Cancel
        </Button>
      }
      sx={{ mb: { xs: 3, md: 5 } }}
    />
    <StoreEditForm />
  </DashboardContent>
);

export default StoreEditView;
