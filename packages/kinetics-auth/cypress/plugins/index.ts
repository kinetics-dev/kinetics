import { createServer } from "vite";

// const debug = require("debug")("cypress:dev-server:vite");

const pluginConfig: Cypress.PluginConfig = async (on, config) => {
  /**
   * We spin up the vite dev server by interacting with the Cypress plugin API
   *
   * @remarks Somehow vite exits with SIGTERM resulted in an error during GitHub Actions, and using
   * `@cypress/vite-dev-server` didn't help either because the lifecycle event `dev-server:start`
   * is not reached no matter how I try...
   */
  const server = await createServer();
  await server.listen().then(() => {
    server.printUrls();
  });

  on("before:run", () => {});

  on("after:run", async () => {
    await server.close();
  });

  return config;
};

export default pluginConfig;
