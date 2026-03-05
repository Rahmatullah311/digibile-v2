import { CONFIG } from 'src/global-config';

import ProductDetailsCreateEditView from 'src/sections/product/view/product-details-create-view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new product | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <ProductDetailsCreateEditView />
    </>
  );
}
