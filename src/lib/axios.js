import axios from 'axios';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: CONFIG.serverUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Optional: Add token (if using auth)
 *
 axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
*
*/

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || error?.message || 'Something went wrong!';
    console.error('Axios error:', message);
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args, {}];

    const res = await axiosInstance.get(url, config);

    return res.data;
  } catch (error) {
    console.error('Fetcher failed:', error);
    throw error;
  }
};

// use to send requests with different HTTP methods
export const apiRequest = async (method, url, data = null, config = {}) => {
  try {
    const res = await axiosInstance({
      method,
      url,
      data,
      ...config,
    });
    return res.data;
  } catch (error) {
    console.error(`Request failed [${method} ${url}]:`, error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/tokenshield/user/me',
    signIn: '/api/tokenshield/token/',
    signUp: '/api/tokenshield/user/register/',
  },
  user: {
    list: '/api/tokenshield/user/all/',
    delete: (id) => `/api/tokenshield/user/${id}/destroy/`,
    create: '/api/tokenshield/user/register/',
    details: (id) => `/api/tokenshield/user/${id}/`,
    update: (id) => `/api/tokenshield/user/${id}/update/`,
    addresses: (userId = null) => ({
      list: `/api/address/addresses/${userId}/addresses`,
      create: '/api/address/my-addresses/',
      details: (id) => `/api/address/my-addresses/${id}/`,
      edit: (id) => `/api/address/my-addresses/${id}/`,
      delete: (id) => `/api/address/my-addresses/${id}/`,
      changeDefault: (user, address) =>
        `/api/address/addresses/${user}/change_default_address/${address}`,
    }),
  },
  store: {
    list: `/api/store/`,
    create: '/api/store/',
    details: (id) => `/api/store/${id}/`,
  },

  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/',
    details: '/api/product/details',
    search: '/api/product/search',
    delete: '/api/product/{id}/',
  },
  category: {
    list: '/api/category/categories/',
    details: '/api/category/categories/', // use this endpoint for patch | put requests
    delete: '/api/category/categories/',
    create: '/api/category/categories/',
  },
  brand: {
    list: '/api/brand/brands/',
    details: '/api/brand/brands/{id}/', // use this endpoint for patch | put requests
    delete: '/api/brand/brands/{id}/',
    create: '/api/brand/brands/',
  },
};
