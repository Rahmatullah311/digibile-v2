import React from 'react';

import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import StoreList from '../store-list';

const StoreListView = () => (
  <DashboardContent>
    <CustomBreadcrumbs
      heading="List"
      links={[
        { name: 'Dashboard', href: paths.dashboard.root },
        { name: 'Stores', href: paths.dashboard.store.list },
        { name: 'List' },
      ]}
      action={
        <Button
          component={RouterLink}
          href={paths.dashboard.store.new}
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New Store
        </Button>
      }
      sx={{ mb: { xs: 3, md: 5 } }}
    />
    <StoreList />
  </DashboardContent>
);

export default StoreListView;
