import React from 'react';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import BrandList from '../brand-list';


const BrandListView = () => {
  const demoConst = '';

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Brands', href: paths.dashboard.brand.root },
          { name: 'List' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.brand.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add brand
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Card
        sx={{
          minHeight: 640,
          flexGrow: { md: 1 },
          display: { md: 'flex' },
          height: { xs: 800, md: '1px' },
          flexDirection: { md: 'column' },
        }}
      >
        <BrandList />
      </Card>
    </DashboardContent>
  );
};

export default BrandListView;
