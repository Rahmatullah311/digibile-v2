import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const metadata = { title: `User addresses list | Dashboard - ${CONFIG.appName}` };
import { UserAddressView } from 'src/sections/user/view/user-address-list-view';

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <UserAddressView />
    </>
  );
}
