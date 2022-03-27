import { inMemoryStorage } from "in-memory-storage";
import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import * as Auth from "../auth";
import { UnauthorizedError } from "../utils";

const noop = () => {};

const AuthConfigContext = createContext<AuthConfig>({
  clientId: "",
  workspaceId: "",
  redirectFrom: "",
  redirectTo: "",
});

export const AuthContext = createContext<Auth>({
  isAuthenticated: null,
  isAuthenticating: false,
  token: null,
  loginWithRedirect: noop,
  logout: noop,
});

export const AuthProvider = ({
  config: _config,
  children: _children,
  ...props
}: PropsWithChildren<
  {
    config: Pick<AuthConfig, "clientId"> &
      Partial<Pick<AuthConfig, "redirectTo">>;
  } & (
    | {
        suspense?: undefined;
      }
    | {
        suspense: true;
        fallback: ReactNode;
      }
  )
>) => {
  const [isAuthenticating, setAuthenticating] = useState(true);
  const [isAuthenticated, setAuthenticated] = useState<boolean | null>(null);

  const config = useMemo<AuthConfig>(() => {
    return {
      clientId: _config.clientId,
      workspaceId: "",
      redirectTo: _config.redirectTo ?? window.location.origin,
      redirectFrom: window.location.href,
    };
  }, [_config]);

  const children = useMemo<ReactNode>(() => {
    if (props.suspense) {
      return isAuthenticating
        ? props.fallback ?? <div>Loading...</div>
        : _children;
    }

    return _children;
  }, [_children, isAuthenticating, props]);

  const handlers = useMemo<Pick<Auth, "loginWithRedirect" | "logout">>(() => {
    return {
      async loginWithRedirect() {
        await Auth.loginWithRedirect(config);
      },
      async logout() {
        await Auth.logout(config);
      },
    };
  }, [config]);

  const ctx = useMemo(
    () => ({
      isAuthenticated,
      isAuthenticating,
      token: inMemoryStorage.getItem<string | null>("token"),
      ...handlers,
    }),
    [handlers, isAuthenticated, isAuthenticating]
  );

  useEffect(() => {
    // Check token session
    const rehydrate = async () => {
      if (!window.location.search.startsWith("?code=")) {
        return setAuthenticating(false);
      }

      try {
        await Auth.requestToken(config);

        setAuthenticated(true);
      } catch (e) {
        // Handle unauthorized error
        if (e instanceof UnauthorizedError) {
          console.log(e);
        }

        setAuthenticated(false);
      }

      setAuthenticating(false);
    };

    rehydrate();
  }, [config]);

  return (
    <AuthConfigContext.Provider value={config}>
      <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>
    </AuthConfigContext.Provider>
  );
};

/**
 * Only render its children if the user is authenticated, otherwise render the fallback instead.
 */
const AuthGuard = ({
  fallback,
  children,
}: PropsWithChildren<{
  fallback: ReactNode;
}>) => {
  const { isAuthenticated } = useAuth();
  return <>{isAuthenticated ? children : fallback}</>;
};

/**
 * A helper to wrap the app with redirect if it's not authenticated
 */
const LoginRedirect = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated === null) loginWithRedirect();
  }, [isAuthenticated, loginWithRedirect]);

  return null;
};

AuthGuard.LoginRedirect = LoginRedirect;

export { AuthGuard };

/**
 * A react hook to access auth context and state. Must be used inside a `<AuthProvider />`.
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) throw new Error("useAuth must be used inside `<AuthProvider />`");

  return ctx;
};
