import nock from "nock";

import { Constants, verifyToken } from "../src";
import * as utils from "../src/utils";

describe("kinetics-node", () => {
  const env = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...env };
  });

  it("throws error if token is not provided", async () => {
    await expect(verifyToken(undefined)).rejects.toThrow("Token is required");
  });

  it("prints warning if one has been returned from the server", async () => {
    process.env.KINETICS_API_KEY = "secret_apiKey";

    jest.spyOn(console, "warn").mockImplementation();

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

  it("prints warning only once throughout the process lifecycle", async () => {
    process.env.KINETICS_API_KEY = "secret_apiKey";

    jest.spyOn(utils, "warn").mockImplementation();
    jest.spyOn(utils, "suppressDeprecationWarning");

    const scope = nock("https://api.kinetics.dev", {
      reqheaders: {
        authorization: `Bearer secret_apiKey`,
      },
    })
      .post("/core/access/auth/verify")
      .times(2)
      .reply(200, {}, { Warning: "API is deprecated" });

    await expect(verifyToken("token")).resolves.toMatchObject({});

    expect(utils.warn).toHaveBeenCalledTimes(1);
    expect(utils.suppressDeprecationWarning).toBeCalled();

    await expect(verifyToken("token")).resolves.toMatchObject({});
    expect(utils.warn).not.toHaveBeenCalledTimes(1);

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
    expect(utils.warn).toBeCalled();

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
