import { toast } from 'sonner';
import { useEffect } from 'react';
import { removeLastSlash } from 'minimal-shared/utils';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useParams, usePathname } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetStoreDetails } from 'src/actions/dashboard/store';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { NotFoundView } from '../error';

// ----------------------------------------------------------------------

const NAV_ITEMS = (id) => [
  {
    label: 'General',
    icon: <Iconify width={24} icon="solar:user-id-bold" />,
    href: paths.dashboard.store.profile(id),
  },
];

// ----------------------------------------------------------------------

export function StoreLayout({ children, ...other }) {
  const pathname = usePathname();
  // get user ID from url parameters
  const { id } = useParams();
  const { storeDetails, storeDetailsError, storeDetailsLoading, mutateStoreDetails } =
    useGetStoreDetails(id);

  useEffect(() => {
    if (storeDetailsError) {
      toast.error(storeDetailsError?.message);
    }
  }, [storeDetailsError]);
  if (!id) {
    return (
      <NotFoundView
        title="Please choose a user!"
        description="Sorry, you did not choose any user, you can choose a user by going to users list."
      />
    );
  }
  return (
    <DashboardContent {...other}>
      <CustomBreadcrumbs
        heading="Profile"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Stores', href: paths.dashboard.store.list },
          { name: storeDetailsLoading ? '...' : `${storeDetails.name}` },
          { name: 'Profile' },
        ]}
        sx={{ mb: 3 }}
      />
      <Tabs value={removeLastSlash(pathname)} sx={{ mb: { xs: 3, md: 5 } }}>
        {NAV_ITEMS(id).map((tab) => (
          <Tab
            component={RouterLink}
            key={tab.href}
            label={tab.label}
            icon={tab.icon}
            value={tab.href}
            href={tab.href}
          />
        ))}
      </Tabs>

      {children}
    </DashboardContent>
  );
}
