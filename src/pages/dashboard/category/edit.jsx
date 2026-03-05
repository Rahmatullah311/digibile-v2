import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetCategory } from 'src/actions/dashboard/category';

import { LoadingScreen } from 'src/components/loading-screen';

import CategoryEditView from 'src/sections/category/view/category-edit-view';

// ----------------------------------------------------------------------

const metadata = { title: `Category edit | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { category, categoryLoading } = useGetCategory(id);

  return (
    <>
      <title>{metadata.title}</title>
      {categoryLoading ? <LoadingScreen /> : <CategoryEditView category={category} />}
    </>
  );
}
