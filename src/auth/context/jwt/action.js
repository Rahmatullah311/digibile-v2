import axios, { endpoints } from 'src/lib/axios';

import { setSession } from './utils';
import { JWT_STORAGE_KEY } from './constant';

// ----------------------------------------------------------------------

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ email, password }) => {
  try {
    const params = { email, password };

    const res = await axios.post(endpoints.auth.signIn, params);

    console.log('Sign in response:', res);

    const { access } = res.data;

    if (!access) {
      throw new Error('Access token not found in response');
    }

    setSession(access);
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({ email, password, password2, first_name, last_name }) => {
  const params = {
    email,
    password,
    password2,
    first_name,
    last_name,
  };

  try {
    const res = await axios.post(endpoints.auth.signUp, params);

    const { access } = res.data;

    if (!access) {
      throw new Error('Access token not found in response');
    }

    sessionStorage.setItem(JWT_STORAGE_KEY, access);
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async () => {
  try {
    await setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
