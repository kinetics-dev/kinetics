import { inMemoryStorage } from "in-memory-storage";

import { NotImplementedError } from "./utils";

const KINETCS_AUTH_URL = import.meta.env.DEV
  ? (import.meta.env.VITE_TEST_AUTH_URL as string)
  : "https://auth.kinetics.workers.dev";

/**
 * Log in with redirect
 */
export const loginWithRedirect = async (config: AuthConfig) => {
  const state = window.btoa(JSON.stringify(config));
  const loginURL = new URL(KINETCS_AUTH_URL);

  loginURL.searchParams.append("state", state);

  window.location.href = loginURL.toString();
};

/**
 * Log out
 */
export const logout = async () => {
  throw new NotImplementedError();
};

/**
 * Utility helper to retrieve token outside of React components
 */
export const getToken = () => {
  return inMemoryStorage.getItem<string | null>("token");
};
