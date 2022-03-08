import nock from "nock";

import { Constants, verifyToken } from "../src";

describe("kinetics-node", () => {
  const env = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...env };
  });

  it("throws error if token is not provided", async () => {
    await expect(verifyToken(undefined)).rejects.toThrow("Token is required");
  });

  it.only("prints warning if one has been returned from the server", async () => {
    process.env.KINETICS_API_KEY = "secret_apiKey";

    jest.spyOn(console, "warn");

    const scope = nock("https://api.kinetics.dev", {
      reqheaders: {
        authorization: `Bearer secret_apiKey`,
      },
    })
      .post("/core/access/auth/verify")
      .reply(200, {}, { Warning: "API is deprecated" });

    await expect(verifyToken("token")).resolves.toMatchObject({});
    expect(console.warn).toBeCalled();

    scope.done();
  });

  it("parses process.env for api secret key", async () => {
    process.env.KINETICS_API_KEY = "secret_apiKey";

    const scope = nock("https://api.kinetics.dev", {
      reqheaders: {
        authorization: `Bearer secret_apiKey`,
      },
    })
      .post("/core/access/auth/verify")
      .reply(200, {});

    await expect(verifyToken("token")).resolves.toMatchObject({});

    scope.done();
  });

  it("parses process.env for client credentials", async () => {
    process.env.KINETICS_CLIENT_ID = "user";
    process.env.KINETICS_CLIENT_SECRET = "pass";

    const scope = nock("https://api.kinetics.dev", {
      reqheaders: {
        authorization: `Basic ${Buffer.from("user:pass").toString("base64")}`,
      },
    })
      .post("/core/access/auth/verify")
      .reply(200, {});

    await expect(verifyToken("token")).resolves.toMatchObject({});

    scope.done();
  });

  it("makes api request with correct headers and body", async () => {
    const scope = nock("https://api.kinetics.dev")
      .post("/core/access/auth/verify")
      .reply(401, { message: "invalid_client" });

    await expect(verifyToken("token")).rejects.toThrow("invalid_client");

    scope.done();
  });

  it("matches api version", async () => {
    const scope = nock("https://api.kinetics.dev", {
      reqheaders: {
        "Api-Version": Constants.apiVersion,
      },
    })
      .post("/core/access/auth/verify")
      .reply(200, {});

    await expect(verifyToken("token")).resolves.toMatchObject({});

    scope.done();
  });
});
