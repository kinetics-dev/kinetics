import React from "react";
import ReactDOM from "react-dom";

import { AuthGuard, AuthProvider, useAuth } from "../src";

const App = () => {
  const { token, logout } = useAuth();
  return (
    <AuthGuard fallback={<AuthGuard.LoginRedirect />}>
      <div style={{ wordBreak: "break-all" }}>Token: {token}</div>
      <button
        onClick={() => {
          logout();
        }}
      >
        log out
      </button>
    </AuthGuard>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider
      config={{ clientId: import.meta.env.VITE_TEST_CLIENT_ID }}
      suspense
      fallback={<div>loading...</div>}
    >
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
