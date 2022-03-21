import("dotenv/config");

const pluginConfig: Cypress.PluginConfig = (on, config) => {
  config.env.username = process.env.TEST_USERNAME;
  config.env.password = process.env.TEST_PASSWORD;

  return config;
};

export default pluginConfig;
