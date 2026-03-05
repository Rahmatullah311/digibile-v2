import { CONFIG } from 'src/global-config';

import { UserAddressEditView } from 'src/sections/user/view/user-address-edit-view';
// ----------------------------------------------------------------------

const metadata = { title: `Edit user address | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <UserAddressEditView />
    </>
  );
}
