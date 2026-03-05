import { useParams } from 'react-router';

import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { AddressCreateForm } from 'src/sections/address';

// ----------------------------------------------------------------------

export function UserAddressCreateView() {
  const { id } = useParams();
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="User Address"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.user.list },
          { name: 'Profile', href: paths.dashboard.user.account(id) },
          { name: 'Address list', href: paths.dashboard.user.address.list(id) },
          { name: 'New address' },
        ]}
        action={
          <Button
            component={RouterLink}
            variant="contained"
            href={paths.dashboard.user.address.list(id)}
            startIcon={<Iconify icon="mingcute:close-line" />}
          >
            Cancel
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <AddressCreateForm />
    </DashboardContent>
  );
}
