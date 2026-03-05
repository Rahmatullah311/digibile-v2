import { CONFIG } from 'src/global-config';

import BrandListView from 'src/sections/brands/views/brand-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Category list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  console.info(
    'when a new brand is created, it is not displayed in the list unless I reload the page'
  );
  return (
    <>
      <title>{metadata.title}</title>
      <BrandListView />
    </>
  );
}
