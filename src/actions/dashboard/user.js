import useSWR from 'swr';
import { useMemo } from 'react';
import useSWRMutation from 'swr/mutation';

import { queryStringBuilder } from 'src/utils/query-string-builder';

import { fetcher, endpoints, apiRequest } from 'src/lib/axios';

const swrOprions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetUsers({ page, pageSize, filters }) {
  const queryString = queryStringBuilder({ page: page + 1, page_size: pageSize, ...filters });
  // add +1 on page because MUI pagination uses zero-based page indexing and Django uses one-based page indexing
  const url = `${endpoints.user.list}?${queryString}`;
  const { data, isLoading, error, isValidating, mutate } = useSWR(url, fetcher, { ...swrOprions });
  const memoizedValue = useMemo(
    () => ({
      users: data || [],
      userLoading: isLoading,
      userError: error,
      userValidating: isValidating,
      mutate,
    }),
    [data, isLoading, error, isValidating, mutate]
  );
  return memoizedValue;
}

const requestDeleteUser = async (url, { arg }) => {
  const { id } = arg;
  const finalUrl = endpoints.user.delete(id);
  const result = await apiRequest('DELETE', finalUrl);
  return result;
};

export function useDeleteUser() {
  const url = endpoints.user.delete;
  const { trigger, isMutating, error } = useSWRMutation(url, requestDeleteUser);
  const memoizedValue = useMemo(
    () => ({
      deleteUser: trigger,
      deleteUserLoading: isMutating,
      deleteUserError: error,
    }),
    [trigger, isMutating, error]
  );
  return memoizedValue;
}

const createUserRequest = async (url, { arg }) =>
  apiRequest('POST', url, arg, { headers: { 'Content-Type': 'multipart/form-data' } });

export const useCreateUser = () => {
  const url = endpoints.user.create;
  const { trigger, data, error, isMutating } = useSWRMutation(url, createUserRequest);
  return {
    createUser: trigger,
    createUserData: data,
    createUserError: error,
    createUserLoading: isMutating,
  };
};

export function useGetUserDetails(userId) {
  const url = endpoints.user.details(userId);
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, { ...swrOprions });
  const memoizedValue = useMemo(
    () => ({
      user: data ?? null,
      userError: error,
      userIsLoading: isLoading,
      mutateUser: mutate,
    }),
    [data, error, isLoading, mutate]
  );

  return memoizedValue;
}

export const requestUpdateUser = (url, { arg }) =>
  apiRequest('PATCH', url, arg, { headers: { 'Content-Type': 'multipart/form-data' } });

export function useUpdateUser(userId) {
  const url = endpoints.user.update(userId);
  const { trigger, error, isMutating, data } = useSWRMutation(url, requestUpdateUser);
  const memoizedValue = useMemo(
    () => ({
      updateUser: trigger,
      updateUserError: error,
      updateUserIsLoading: isMutating,
      updateUserData: data,
    }),
    [trigger, error, isMutating, data]
  );
  return memoizedValue;
}

export function useGetUserAddresses(userId) {
  const url = endpoints.user.addresses(userId).list;
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, { ...swrOprions });
  const memoizedValue = useMemo(
    () => ({
      addresses: data,
      addressesError: error,
      addressesIsLoading: isLoading,
      mutateAddresses: mutate,
    }),
    [data, error, isLoading, mutate]
  );
  return memoizedValue;
}

const requestCreateUserAddress = (url, { arg }) =>
  apiRequest('POST', url, arg, { headers: { 'Content-Type': 'application/json' } });

export const useCreateUserAddress = () => {
  const url = endpoints.user.addresses().create;
  const { trigger, isMutating, error, data } = useSWRMutation(url, requestCreateUserAddress);
  const memoizedValue = useMemo(
    () => ({
      createAddress: trigger,
      createAddressIsLoading: isMutating,
      createAddressError: error,
      createAddressData: data,
    }),
    [trigger, isMutating, error, data]
  );
  return memoizedValue;
};

const requestDeleteAddress = (url, { arg }) => apiRequest('DELETE', url);

export function useDeleteAddress(userId) {
  const url = endpoints.user.addresses().delete(userId);
  const { trigger, error, isMutating } = useSWRMutation(url, requestDeleteAddress);
  const memoizedValue = useMemo(
    () => ({
      deleteAddress: trigger,
      deleteAddressError: error,
      deleteAddressIsLoading: isMutating,
    }),
    [trigger, error, isMutating]
  );
  return memoizedValue;
}

const requestChangeDefaultAddress = (url, { arg }) => apiRequest('PATCH', url(arg));

export function useChangeDefaultAddress() {
  const url = ({ userId, addressId }) =>
    endpoints.user.addresses().changeDefault(userId, addressId);
  const { trigger, error, isMutating } = useSWRMutation('change-default-address', (key, { arg }) =>
    requestChangeDefaultAddress(url, { arg })
  );

  const memoizedValue = useMemo(
    () => ({
      changeDefaultAddress: trigger,
      changeDefaultAddressError: error,
      changeDefaultAddressLoading: isMutating,
    }),
    [trigger, error, isMutating]
  );
  return memoizedValue;
}

export function useGetAddressDetails(addressId) {
  const url = endpoints.user.addresses().details(addressId);

  const { data, error, isLoading, mutate } = useSWR(url, fetcher, { ...swrOprions });

  const memoizedValue = useMemo(
    () => ({
      address: data,
      addressError: error,
      addressIsLoading: isLoading,
      mutateAddress: mutate,
    }),
    [data, error, isLoading, mutate]
  );

  return memoizedValue;
}

const requestUpdateAddress = (url, { arg }) => apiRequest('PATCH', url, arg);

export function useUpdateAddress(addressId) {
  const url = endpoints.user.addresses().edit(addressId);
  const { trigger, error, isMutating } = useSWRMutation(url, requestUpdateAddress);
  const memoizedValue = useMemo(
    () => ({
      updateAddress: trigger,
      updateAddressError: error,
      updateAddressIsLoading: isMutating,
    }),
    [trigger, error, isMutating]
  );
  return memoizedValue;
}

const requestGetUserDetails = (url, { arg }) => apiRequest('GET', url(arg));

export function useGetUserDetailsTrigger() {
  const url = (userId) => endpoints.user.details(userId);
  const { trigger, error, isMutating, data } = useSWRMutation('get-user-detail', (key, { arg }) =>
    requestGetUserDetails(url, { arg })
  );

  const memoizedValue = useMemo(
    () => ({
      getUserDetails: trigger,
      userDetails: data,
      getUserDetailsError: error,
      getUserDetailsLoading: isMutating,
    }),
    [trigger, data, error, isMutating]
  );
  return memoizedValue;
}
