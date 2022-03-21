/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect } from "react";
import ReactDOM from "react-dom";

import { AuthProvider, useAuth } from "./src";

const App = () => {
  const { isAuthenticated, isAuthenticating, loginWithRedirect, token } =
    useAuth();

  useEffect(() => {
    if (!isAuthenticating && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isAuthenticated, isAuthenticating, loginWithRedirect]);

  if (isAuthenticating) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <div>Token: {token}</div> : <div>Hello world</div>;
};

ReactDOM.render(
  <React.StrictMode>
    {/* @ts-ignore */}
    <AuthProvider config={{ clientId: import.meta.env.VITE_TEST_CLIENT_ID }}>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
