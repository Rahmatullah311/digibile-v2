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

export function useGetStores({ page, page_size, filters }) {
  const queryString = queryStringBuilder({ page: page + 1, page_size, ...filters });
  const url = `${endpoints.store.list}?${queryString}`;
  const { data, isLoading, error, mutate } = useSWR(url, fetcher, { ...swrOptions });
  const memoizedValue = useMemo(
    () => ({
      stores: data,
      storesIsLoading: isLoading,
      storesErrors: error,
      mutateStores: mutate,
    }),
    [data, isLoading, error, mutate]
  );
  return memoizedValue;
}

const createStoreRequest = async (url, { arg }) =>
  apiRequest('POST', url, arg, { headers: { 'Content-Type': 'multipart/form-data' } });

export const useCreateStore = () => {
  const url = endpoints.store.create;
  const { trigger, data, error, isMutating } = useSWRMutation(url, createStoreRequest);
  return {
    createStore: trigger,
    createStoreData: data,
    createStoreError: error,
    createStoreLoading: isMutating,
  };
};

export function useGetStoreDetails(storeId) {
  const url = endpoints.store.details(storeId);

  const { data, isLoading, error, mutate } = useSWR(url, fetcher, { ...swrOptions });

  const memoizedValue = useMemo(
    () => ({
      storeDetails: data,
      storeDetailsLoading: isLoading,
      storeDetailsError: error,
      mutateStoreDetails: mutate,
    }),
    [data, isLoading, error, mutate]
  );

  return memoizedValue;
}

const updateStoreRequest = async (url, { arg }) =>
  apiRequest('PATCH', url, arg, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const useUpdateStore = (id) => {
  const url = endpoints.store.details(id);

  const { trigger, data, error, isMutating } = useSWRMutation(url, updateStoreRequest);

  return {
    updateStore: trigger,
    updateStoreData: data,
    updateStoreError: error,
    updateStoreLoading: isMutating,
  };
};
