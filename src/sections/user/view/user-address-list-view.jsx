import { DashboardContent } from 'src/layouts/dashboard';

import UserAddressesList from '../user-addresses-list';

// ----------------------------------------------------------------------

export function UserAddressView() {
  return (
    <DashboardContent>
      <UserAddressesList />
    </DashboardContent>
  );
}
