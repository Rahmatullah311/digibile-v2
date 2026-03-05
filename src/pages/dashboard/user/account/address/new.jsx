import { CONFIG } from 'src/global-config';

import { UserAddressCreateView } from 'src/sections/user/view/user-address-create-view';
// ----------------------------------------------------------------------

const metadata = { title: `Create new user address | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <UserAddressCreateView />
    </>
  );
}
