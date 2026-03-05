import useSWR from 'swr';
import { useMemo } from 'react';
import useSWRMutation from 'swr/mutation';

import { fetcher, endpoints, apiRequest } from 'src/lib/axios';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetCategories() {
  const url = endpoints.category.list;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, {
    ...swrOptions,
  });

  const memoizedValue = useMemo(
    () => ({
      categories: data || [],
      categoriesIsLoading: isLoading,
      categoriesError: error,
      categoriesIsValidating: isValidating,
      categoriesEmpty: !isLoading && !isValidating && !data.length,
    }),
    [data, isLoading, error, isValidating]
  );

  return memoizedValue;
}

export function useGetCategory(categoryId) {
  const url = categoryId ? `${endpoints.category.details}${categoryId}` : '';
  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, {
    ...swrOptions,
    revalidateOnMount: true,
  });

  const memoizedValue = useMemo(
    () => ({
      category: data,
      categoryLoading: isLoading,
      categoryError: error,
      categoryValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

async function createCategoryRequest(url, { arg }) {
  return apiRequest('POST', url, arg, { headers: { 'Content-Type': 'multipart/form-data' } });
}

export function useCreateCategory() {
  const url = endpoints.category.create;
  const { trigger, data, error, isMutating } = useSWRMutation(url, createCategoryRequest);
  return {
    createCategory: trigger,
    createCategoryResponse: data,
    createCategoryError: error,
    createCategoryLoading: isMutating,
  };
}

async function updateCategoryRequest(url, { arg }) {
  const { categoryId, ...payload } = arg;
  console.debug('Updating category with data:', payload);
  return apiRequest('PATCH', `${url}${categoryId}/`, payload.payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function useUpdateCategory() {
  const url = endpoints.category.details;

  const { trigger, data, error, isMutating, isValidating } = useSWRMutation(
    url,
    updateCategoryRequest
  );

  return {
    updateCategory: trigger, // call this to PUT
    updateCategoryResponse: data, // response data
    updateCategoryError: error, // error (if any)
    updateCategoryLoading: isMutating, // loading state
    updateCategoryValidating: isValidating, // validating state
  };
}

async function deleteCategoryRequest(url, { arg }) {
  console.debug('categoryId', arg);
  return apiRequest('DELETE', `${url}${arg}/`);
}
export function useDeleteCategory() {
  const url = endpoints.category.delete;

  const { trigger, data, error, isMutating, isValidating } = useSWRMutation(
    url,
    deleteCategoryRequest
  );

  return {
    deleteCategory: trigger, // call this to PUT
    deleteCategoryResponse: data, // response data
    deleteCategoryError: error, // error (if any)
    deleteCategoryLoading: isMutating, // loading state
    deleteCategoryValidating: isValidating, // validating state
  };
}
