import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserEditForm } from '../user-edit-form';

// ----------------------------------------------------------------------

export function UserEditView({ user: currentUser }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        backHref={paths.dashboard.user.list}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.user.root },
          { name: `${currentUser?.first_name}  ${currentUser?.last_name}` },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <UserEditForm currentUser={currentUser} />
    </DashboardContent>
  );
}
