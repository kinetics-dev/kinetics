interface AuthConfig {
  clientId: string;
  redirectURI: string;
  redirectFrom: string;
  responseType: "token" | "code";
}

interface Auth {
  /**
   *
   */
  isAuthenticating: boolean;

  /**
   *
   */
  isAuthenticated: boolean;

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
