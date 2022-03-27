import { inMemoryStorage } from "in-memory-storage";
import { nanoid } from "nanoid";

import { UnauthorizedError } from "./utils";

const KineticsAuthKeys = {
  STATE: "@kinetics-dev/auth.state",
  CODE_VERIFIER: "@kinetics-dev/auth.code_verifier",
};

const kineticsAuthURL = import.meta.env.DEV
  ? (import.meta.env.VITE_TEST_AUTH_URL as string)
  : "https://auth.kinetics.dev";

const handleNavigate = (url: string) => {
  window.location.href = url;
};

/**
 * Log in with redirect
 */
export const loginWithRedirect = async (config: AuthConfig) => {
  const loginURL = new URL("/oauth/authorize", kineticsAuthURL);

  const state = nanoid(9);
  const codeVerifier = nanoid();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  localStorage.setItem(KineticsAuthKeys.STATE, state);
  localStorage.setItem(KineticsAuthKeys.CODE_VERIFIER, codeVerifier);

  loginURL.searchParams.append("response_type", "code");
  loginURL.searchParams.append("code_challenge_method", "S256");
  loginURL.searchParams.append("code_challenge", codeChallenge);
  loginURL.searchParams.append("client_id", config.clientId);
  loginURL.searchParams.append("redirect_uri", config.redirectTo);
  loginURL.searchParams.append("state", state);

  handleNavigate(loginURL.toString());
};

/**
 * Log out
 */
export const logout = async (config: AuthConfig) => {
  const logoutURL = new URL("/logout", kineticsAuthURL);

  logoutURL.searchParams.append("client_id", config.clientId);
  logoutURL.searchParams.append("redirect_uri", config.redirectTo);

  handleNavigate(logoutURL.toString());
};

/**
 * Utility helper to retrieve token outside of React components
 */
export const getToken = () => {
  return inMemoryStorage.getItem<string | null>("token");
};

/**
 * Utility helper to request token in exchange of granted code
 */
export const requestToken = async (config: AuthConfig) => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const state = params.get("state");
  const codeVerifier = localStorage.getItem(KineticsAuthKeys.CODE_VERIFIER);

  // Handle authorization code grant redirect
  window.history.replaceState(null, document.title, window.location.pathname);

  if (!code || !state || !codeVerifier || !isStateConsistent(state)) {
    throw new UnauthorizedError("invalid_request");
  }

  const url = new URL("/oauth/token", kineticsAuthURL);
  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectTo,
      grant_type: "authorization_code",
      code,
      code_verifier: codeVerifier,
      state,
    }),
  }).then((res) => res.json() as Promise<ErrorResponse | AccessTokenResponse>);

  if ("error" in response) {
    throw new UnauthorizedError(response.error);
  }

  inMemoryStorage.setItem("token", response["access_token"]);

  return response;
};

/**
 * Check that the received state is the same as the one stored locally to mitigate CSRF attacks
 */
const isStateConsistent = (state: string) =>
  !!state && state === localStorage.getItem(KineticsAuthKeys.STATE);

/**
 * Generate a code challenge derived from the code verifier using S256
 */
const generateCodeChallenge = async (codeVerifier: string) => {
  const bytes = new TextEncoder().encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", bytes);

  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};
