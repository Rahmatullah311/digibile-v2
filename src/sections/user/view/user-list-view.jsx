import React from 'react';

import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import UserList from '../user-list';

export const UserListView = () => (
  <DashboardContent>
    <CustomBreadcrumbs
      heading="List"
      links={[
        { name: 'Dashboard', href: paths.dashboard.root },
        { name: 'Users', href: paths.dashboard.user.list },
        { name: 'List' },
      ]}
      action={
        <Button
          component={RouterLink}
          href={paths.dashboard.user.new}
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New User
        </Button>
      }
      sx={{ mb: { xs: 3, md: 5 } }}
    />
    <UserList />
  </DashboardContent>
);
