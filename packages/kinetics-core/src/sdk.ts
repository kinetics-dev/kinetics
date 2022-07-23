import fetch, { Headers } from "node-fetch";

import { Constants } from "./constants";
import { VerifyTokenError } from "./errors";
import { Config, ServiceError, User } from "./types";
import {
  shouldPrintDeprecationWarning,
  suppressDeprecationWarning,
  warn,
} from "./utils";

const { apiVersion, serviceURL } = Constants;

/**
 * Shortcut helper for making an POST /introspect request followed up by a GET /userinfo request
 */
export const verifyToken = async (
  /**
   * Token passed from the client that is forwarded to the authorization server
   */
  token: string,

  /**
   * Custom configuration
   */
  config?: Config
): Promise<User> => {
  if (!token) throw new Error("Token is required");

  const credential = {
    apiKey: process.env.KINETICS_API_KEY,
    clientId: process.env.KINETICS_CLIENT_ID,
    clientSecret: process.env.KINETICS_CLIENT_SECRET,
    ...config,
  };

  const headers = new Headers();

  /**
   * Mutually exclusive
   */
  if (credential.clientId) {
    const { clientId, clientSecret } = credential;
    const userCredential = `${clientId}:${clientSecret}`;
    const base64Credential = Buffer.from(userCredential).toString("base64");
    headers.set("Authorization", "Basic " + base64Credential);
  } else if (credential.apiKey) {
    const { apiKey } = credential;
    headers.set("Authorization", "Bearer " + apiKey);
  }

  headers.set("Api-Version", apiVersion);
  headers.set("Content-Type", "application/x-www-form-urlencoded");

  const body = new URLSearchParams();
  body.set("token", token);

  const response = await fetch(`${serviceURL}/access/auth/verify`, {
    method: "POST",
    headers,
    body,
  });

  if (shouldPrintDeprecationWarning && response.headers.has("warning")) {
    warn(`${response.headers.get("warning")}`);
    suppressDeprecationWarning();
  }

  const json = await response.json();

  if (response.ok) {
    return json as User;
  } else {
    throw new VerifyTokenError(json as ServiceError);
  }
};

/**
 * Shortcut helper for making an GET /workspaces/:alias/members/:id request
 */
export const getMember = async (
  /**
   * Token passed from the client that is forwarded to the authorization server
   */
  id: string,

  /**
   * Custom configuration
   */
  config?: Config
): Promise<User> => {
  if (!id) throw new Error("Member ID is required");

  const credential = {
    apiKey: process.env.KINETICS_API_KEY,
    clientId: process.env.KINETICS_CLIENT_ID,
    clientSecret: process.env.KINETICS_CLIENT_SECRET,
    workspace: process.env.KINETICS_WORKSPACE,
    ...config,
  };

  if (!credential.workspace) throw new Error("Workspace is required");

  const headers = new Headers();

  /**
   * Mutually exclusive
   */
  if (credential.clientId) {
    const { clientId, clientSecret } = credential;
    const userCredential = `${clientId}:${clientSecret}`;
    const base64Credential = Buffer.from(userCredential).toString("base64");
    headers.set("Authorization", "Basic " + base64Credential);
  } else if (credential.apiKey) {
    const { apiKey } = credential;
    headers.set("Authorization", "Bearer " + apiKey);
  }

  headers.set("Api-Version", apiVersion);

  const response = await fetch(
    `${serviceURL}/workspaces/${credential.workspace}/members/${id}`,
    {
      headers,
    }
  );

  if (shouldPrintDeprecationWarning && response.headers.has("warning")) {
    warn(`${response.headers.get("warning")}`);
    suppressDeprecationWarning();
  }

  const json = await response.json();

  if (response.ok) {
    return json as User;
  } else {
    throw json;
  }
};
