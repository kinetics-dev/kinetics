interface AuthConfig {
  clientId: string;
  workspaceId: string;
  redirectTo: string;
  redirectFrom: string;
}

interface Auth {
  /**
   *
   */
  isAuthenticating: boolean;

  /**
   *
   */
  isAuthenticated: boolean | null;

  /**
   *
   */
  token: string | null;

  /**
   *
   */
  loginWithRedirect: () => Promise<void> | void;

  /**
   *
   */
  logout: () => Promise<void> | void;
}

interface AccessTokenResponse {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
}

interface ErrorResponse {
  error: string;
}
