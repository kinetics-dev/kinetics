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

const noop = () => {};

const AuthConfigContext = createContext<AuthConfig>({
  clientId: "",
  responseType: "token",
  redirectURI: "",
  redirectFrom: "",
});

export const AuthContext = createContext<Auth>({
  isAuthenticated: false,
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
  | {
      config: Pick<AuthConfig, "clientId"> &
        Partial<Pick<AuthConfig, "redirectURI">>;
      suspense?: undefined;
    }
  | {
      config: Pick<AuthConfig, "clientId"> &
        Partial<Pick<AuthConfig, "redirectURI">>;
      suspense: true;
      fallback: ReactNode;
    }
>) => {
  const [isAuthenticating, setAuthenticating] = useState(true);
  const [isAuthenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check token session
    const rehydrate = async () => {
      const params = new URLSearchParams(window.location.search);

      if (params.get("token")) {
        inMemoryStorage.setItem("token", params.get("token"));
        setAuthenticated(true);
      }

      setAuthenticating(false);
    };

    rehydrate();
  }, []);

  const config = useMemo<AuthConfig>(() => {
    return {
      clientId: _config.clientId,
      redirectURI: _config.redirectURI ?? window.location.origin,
      redirectFrom: window.location.href,
      responseType: "token",
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
        await Auth.loginWithRedirect({
          clientId: config.clientId,
          redirectURI: window.location.origin,
          redirectFrom: window.location.href,
          responseType: "token",
        });
      },
      async logout() {
        await Auth.logout();
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

  return (
    <AuthConfigContext.Provider value={config}>
      <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>
    </AuthConfigContext.Provider>
  );
};

/**
 * A react hook to access auth context and state. Must be used inside a `<AuthProvider />`.
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  return ctx;
};
