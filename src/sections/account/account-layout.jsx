import { toast } from 'sonner';
import { useEffect } from 'react';
import { removeLastSlash } from 'minimal-shared/utils';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useParams, usePathname } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetUserDetails } from 'src/actions/dashboard/user';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { NotFoundView } from '../error';

// ----------------------------------------------------------------------

const NAV_ITEMS = (id) => [
  {
    label: 'General',
    icon: <Iconify width={24} icon="solar:user-id-bold" />,
    href: paths.dashboard.user.account(id),
  },
  {
    label: 'Billing',
    icon: <Iconify width={24} icon="solar:bill-list-bold" />,
    href: `${paths.dashboard.user.account(id)}/billing`,
  },
  {
    label: 'Address',
    icon: <Iconify width={24} icon="solar:map-point-bold" />,
    href: `${paths.dashboard.user.address.list(id)}`,
  },
  {
    label: 'Notifications',
    icon: <Iconify width={24} icon="solar:bell-bing-bold" />,
    href: `${paths.dashboard.user.account(id)}/notifications`,
  },
  {
    label: 'Social links',
    icon: <Iconify width={24} icon="solar:share-bold" />,
    href: `${paths.dashboard.user.account(id)}/socials`,
  },
  {
    label: 'Security',
    icon: <Iconify width={24} icon="ic:round-vpn-key" />,
    href: `${paths.dashboard.user.account(id)}/change-password`,
  },
];

// ----------------------------------------------------------------------

export function AccountLayout({ children, ...other }) {
  const pathname = usePathname();
  // get user ID from url parameters
  const { id } = useParams();
  const { user, userIsLoading, mutateUser, userError } = useGetUserDetails(id);

  useEffect(() => {
    if (userError) {
      toast.error(userError?.message);
    }
  }, [userError]);
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
        heading="Account"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Users', href: paths.dashboard.user.list },
          { name: userIsLoading ? '...' : `${user.first_name} ${user.last_name}` },
          { name: 'Account' },
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
