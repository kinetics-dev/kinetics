import path from "path";
import webpack, { Configuration } from "webpack";
import { merge } from "webpack-merge";

import { parseAppIdentifier } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const SystemJSPublicPathWebpackPlugin = require("systemjs-webpack-interop/SystemJSPublicPathWebpackPlugin");

export const withKineticsWebpackConfig = (
  webpackConfig: Configuration,
  options: WithKineticsWebpackConfigOptions
) => {
  const [orgName, projectName] = parseAppIdentifier(options.appIdentifier);

  webpackConfig.module!.rules = [
    { parser: { system: false } },
    ...webpackConfig.module!.rules!,
  ];

  webpackConfig.entry = path.resolve(
    process.cwd(),
    `src/${orgName}-${projectName}.tsx`
  );

  webpackConfig.output = {
    filename: `${orgName}-${projectName}.js`,
    libraryTarget: "system",
    path: path.resolve(process.cwd(), "build"),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: webpack 4 API {@link https://github.com/webpack/webpack.js.org/issues/3940}
    [/^5\.\d+\.\d+$/.test(webpack.version)
      ? "chunkLoadingGlobal"
      : "jsonpFunction"]: `webpackJsonp_${projectName}`,
  };

  webpackConfig.optimization!.splitChunks = {
    cacheGroups: {
      default: false,
    },
  };
  // Move runtime into bundle instead of separate file
  webpackConfig.optimization!.runtimeChunk = false;

  return merge(webpackConfig, {
    externals: ["react", "react-dom", "single-spa"],

    plugins: [
      new SystemJSPublicPathWebpackPlugin({
        systemjsModuleName: options.appIdentifier,
      }),
    ],
  });
};
