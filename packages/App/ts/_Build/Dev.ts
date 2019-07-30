import * as Path from "path";

import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as Webpack from "webpack";

const config: Webpack.Configuration = {
  devtool: "source-map",
  entry: {
    index: Path.resolve(__dirname, "../renderer.js"),
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "source-map-loader",
        enforce: "pre",
      },
    ],
  },
  output: {
    filename: "[name].js",
    path: Path.resolve(__dirname, "../../webpack/dev"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: Path.resolve(__dirname, "../../../html/index.html"),
      inlineSource: ".js",
    }),
  ],
  resolve: {
    extensions: [".js"],
  },
};

export default config;
