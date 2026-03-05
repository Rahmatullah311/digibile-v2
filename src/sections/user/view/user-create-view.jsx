import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserCreateForm } from '../user-create-form';

// ----------------------------------------------------------------------

export function UserCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create new user"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.user.list },
          { name: 'Create' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserCreateForm />
    </DashboardContent>
  );
}
