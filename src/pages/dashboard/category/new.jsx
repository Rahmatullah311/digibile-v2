import { CONFIG } from 'src/global-config';

import CategoryCreateView from 'src/sections/category/view/category-create-view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new product | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <CategoryCreateView />
    </>
  );
}
