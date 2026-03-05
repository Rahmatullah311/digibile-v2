import { CONFIG } from 'src/global-config';

import StoreListView from 'src/sections/store/views/store-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Stores list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <StoreListView />
    </>
  );
}
