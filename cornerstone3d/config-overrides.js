const webpack = require("webpack");

module.exports = function override(config, env) {
  // Add fallback for Node modules used in wasm decoders
  config.resolve = {
    ...config.resolve,
    fallback: {
      ...config.resolve?.fallback,
      fs: false,
      path: require.resolve("path-browserify"),
    },
  };

  // Add wasm support
  config.module.rules.push({
    test: /\.wasm$/,
    type: "asset/resource",
  });

  return config;
};
