import fetch, { Headers } from "node-fetch";

import { Config, ServiceError, User } from "./types";
import { VerifyTokenError } from "./utils";

const API_VERSION = "2022-02-22";
const SDK_VERSION = "0.1.0";
const KINETICS_BASE_URL = "https://api.kinetics.dev";
const KINETICS_CORE_SVC_URL = `${KINETICS_BASE_URL}/core`;
const KINETICS_CORE_GQL_SVC_URL = `${KINETICS_CORE_SVC_URL}/graphql`;

export const Constants = {
  apiVersion: API_VERSION,
  sdkVersion: SDK_VERSION,
  gqlServiceURL: KINETICS_CORE_GQL_SVC_URL,
};

/**
 * Shortcut helper for making an POST /introspect request followed up by a GET /userinfo request
 */
export const verifyToken = async (
  /**
   * Token passed from the client that is forwareded to the authorization server
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

  if (credential.clientId) {
    const { clientId, clientSecret } = credential;
    const userCredential = `${clientId}:${clientSecret}`;
    const base64Credential = Buffer.from(userCredential).toString("base64");
    headers.set("Authorization", "Basic " + base64Credential);
  }

  if (credential.apiKey) {
    const { apiKey } = credential;
    headers.set("Authorization", "Bearer " + apiKey);
  }

  headers.set("Api-Version", API_VERSION);
  headers.set("Content-Type", "application/x-www-form-urlencoded");

  const body = new URLSearchParams();
  body.set("token", token);

  const response = await fetch(`${KINETICS_CORE_SVC_URL}/access/auth/verify`, {
    method: "POST",
    headers,
    body,
  });

  if (response.headers.has("warning")) {
    console.warn(
      "\x1b[33m%s\x1b[0m",
      `[KINETICS] ${response.headers.get("warning")}`
    );
  }

  const json = await response.json();

  if (response.ok) {
    return json as User;
  } else {
    throw new VerifyTokenError(json as ServiceError);
  }
};

export * from "./types";
