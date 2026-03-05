import useSWR from 'swr';
import { useMemo } from 'react';
import useSWRMutation from 'swr/mutation';

import { queryStringBuilder } from 'src/utils/query-string-builder';

import { fetcher, endpoints, apiRequest } from 'src/lib/axios';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetBrands({ page, pageSize, filters }) {
  const queryString = queryStringBuilder({ page: page + 1, page_size: pageSize, ...filters });
  const url = `${endpoints.brand.list}?${queryString}`;

  const { data, isLoading, error, isMutating, mutate } = useSWR(url, fetcher, {
    ...swrOptions,
  });

  const memoizedValue = useMemo(
    () => ({
      brands: data || [],
      brandLoading: isLoading,
      brandError: error,
      brandEmpty: !isLoading && !data,
      brandMutating: isMutating,
      mutateBrands: mutate,
    }),
    [data, isLoading, error, isMutating, mutate]
  );
  return memoizedValue;
}

export function useGetBrand(brandId) {
  const url = endpoints.brand.details;
  const finalUrl = `${url.replace('{id}', brandId)}`;
  const { data, isLoading, error, isMutating } = useSWR(finalUrl, fetcher, { ...swrOptions });
  const memoizedValue = useMemo(
    () => ({
      brand: data || {},
      brandLoading: isLoading,
      brandError: error,
      brandMutating: isMutating,
    }),
    [data, isLoading, error, isMutating]
  );
  return memoizedValue;
}

const requestDeleteBrand = async (url, { arg }) => {
  const { brandId } = arg;
  const finalUrl = `${url.replace('{id}', brandId)}`;
  const result = await apiRequest('DELETE', finalUrl);
  return result;
};

export function useDeleteBrand() {
  const url = endpoints.brand.delete;

  const { trigger, isMutating, error } = useSWRMutation(url, requestDeleteBrand);

  const memoizedValue = useMemo(
    () => ({
      deleteBrand: trigger,
      deleteBrandLoading: isMutating,
      deleteBrandError: error,
    }),
    [trigger, isMutating, error]
  );

  return memoizedValue;
}

async function createBrandRequest(url, { arg }) {
  return apiRequest('POST', url, arg, { headers: { 'Content-Type': 'multipart/form-data' } });
}

export function useCreateBrand() {
  const url = endpoints.brand.create;
  const { trigger, data, error, isMutating } = useSWRMutation(url, createBrandRequest);
  return {
    createBrand: trigger,
    createBrandResponse: data,
    createBrandError: error,
    createBrandLoading: isMutating,
  };
}

async function updateBrandRequest(url, { arg }) {
  const { brandId, payload } = arg;
  const finalUrl = `${url.replace('{id}', brandId)}`;
  const result = await apiRequest('PATCH', finalUrl, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return result;
}

export function useUpdateBand() {
  const url = endpoints.brand.details;
  const { trigger, isMutating, error } = useSWRMutation(url, updateBrandRequest);
  const memoizedValue = useMemo(
    () => ({
      updateBrand: trigger,
      updateBrandLoading: isMutating,
      updateBrandError: error,
    }),
    [trigger, isMutating, error]
  );
  return memoizedValue;
}
