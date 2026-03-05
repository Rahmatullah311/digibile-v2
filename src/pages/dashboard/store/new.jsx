import { CONFIG } from 'src/global-config';

import StoreCreateview from 'src/sections/store/views/store-create-view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new store | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <StoreCreateview />
    </>
  );
}
