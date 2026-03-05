import useSWR from 'swr';
import { useMemo } from 'react';
import useSWRMutation from 'swr/mutation';

import { fetcher, endpoints, apiRequest } from 'src/lib/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

export function useGetProducts() {
  const url = endpoints.product.list;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, {
    ...swrOptions,
  });

  const memoizedValue = useMemo(
    () => ({
      products: data || [],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !isValidating && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetProduct(productId) {
  const url = productId ? [endpoints.product.details, { params: { productId } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, {
    ...swrOptions,
  });

  const memoizedValue = useMemo(
    () => ({
      product: data?.product,
      productLoading: isLoading,
      productError: error,
      productValidating: isValidating,
    }),
    [data?.product, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchProducts(query) {
  const url = query ? [endpoints.product.search, { params: { query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, {
    ...swrOptions,
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.results || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !isValidating && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useDeleteProduct() {
  const url = endpoints.product.delete; // e.g., '/api/products/{id}/'

  // SWRMutation mutation function
  const deleteProductRequest = async (args, params) => {
    const { arg } = params;
    return await apiRequest('DELETE', url.replace('{id}', arg));
  };

  const { trigger, data, error, isMutating } = useSWRMutation(url, deleteProductRequest, {
    ...swrOptions,
  });

  return {
    deleteProduct: trigger, // function to call, e.g. deleteProduct({ id: 123 })
    deleteResponse: data, // response after deletion
    deleteError: error,
    deleteLoading: isMutating,
  };
}
