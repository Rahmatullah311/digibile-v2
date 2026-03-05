import { toast } from 'sonner';
import { useEffect } from 'react';
import { useParams } from 'react-router';

import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetAddressDetails } from 'src/actions/dashboard/user';

import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { AddressEditForm } from 'src/sections/address/address-edit-form';
// ----------------------------------------------------------------------

export function UserAddressEditView() {
  const { id, address_id } = useParams();

  const { address, addressError, addressIsLoading, mutateAddress } =
    useGetAddressDetails(address_id);

  useEffect(() => {
    addressError && toast.error(addressError.message);
  }, [addressError]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="User Address"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.user.list },
          { name: 'Profile', href: paths.dashboard.user.account(id) },
          { name: 'Address list', href: paths.dashboard.user.address.list(id) },
          { name: 'Edit address' },
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
      {addressIsLoading ? <LoadingScreen /> : <AddressEditForm currentAddress={address} />}
    </DashboardContent>
  );
}
