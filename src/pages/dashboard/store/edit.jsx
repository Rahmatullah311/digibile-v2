import React from 'react';
import { useParams } from 'react-router';

import { CONFIG } from 'src/global-config';

import StoreEditView from 'src/sections/store/views/store-edit-view';

const metadata = { title: `Stores list | Dashboard - ${CONFIG.appName}` };
const Page = () => {
  const { id } = useParams();
  return (
    <>
      <title>{metadata.title}</title>
      <StoreEditView />
      <h1>{id}</h1>
    </>
  );
};

export default Page;
