import React from 'react';

import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import StoreCreateform from '../store-create-form';

const StoreCreateview = () => (
  <DashboardContent>
    <CustomBreadcrumbs
      heading="User Address"
      links={[
        { name: 'Dashboard', href: paths.dashboard.root },
        { name: 'Stores', href: paths.dashboard.store.list },
        { name: 'Stores list', href: paths.dashboard.store.list },
        { name: 'New Store' },
      ]}
      action={
        <Button
          component={RouterLink}
          variant="contained"
          href={paths.dashboard.store.list}
          startIcon={<Iconify icon="mingcute:close-line" />}
        >
          Cancel
        </Button>
      }
      sx={{ mb: { xs: 3, md: 5 } }}
    />
    <StoreCreateform />
  </DashboardContent>
);

export default StoreCreateview;
