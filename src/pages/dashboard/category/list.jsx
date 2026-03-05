import { CONFIG } from 'src/global-config';

import CategoryListView from 'src/sections/category/view/category-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Category list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <CategoryListView />
    </>
  );
}
