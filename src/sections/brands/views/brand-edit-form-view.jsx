import { toast } from 'sonner';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';

import { useGetBrand } from 'src/actions/dashboard/brand';

import { LoadingScreen } from 'src/components/loading-screen';

import BrandEditForm from '../brand-edit-form';

const BrandEditFormView = () => {
  const { id } = useParams();
  const { brand, brandError, brandLoading } = useGetBrand(id);
  useEffect(() => {
    try {
      if (brandError) {
        toast.error(brandError.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [brandError]);
  return brandLoading ? LoadingScreen : <BrandEditForm currentBrand={brand} />;
};
export default BrandEditFormView;
