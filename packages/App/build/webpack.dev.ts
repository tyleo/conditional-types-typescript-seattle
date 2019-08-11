import * as Path from "path";

import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as Webpack from "webpack";

// From target/ts/commonjs/_Build
const basePath = Path.resolve(__dirname, "../..");
const baseRelative = (path: string) => Path.resolve(basePath, path);
const srcPath = Path.resolve(basePath, "target/ts");
const srcRelative = (path: string) => Path.resolve(srcPath, path);

const config: Webpack.Configuration = {
  devtool: "source-map",
  entry: {
    index: srcRelative("renderer.js"),
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "source-map-loader",
        enforce: "pre",
      },
      {
        test: /\.(png|obj|mtl)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "asset/obj",
              include: [baseRelative("asset/obj")],
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              include: ["font-awesome"],
              outputPath: "asset/font-awesome",
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  output: {
    filename: "[name].js",
    path: baseRelative("target/webpack/dev"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: baseRelative("asset/html/index.html"),
      inlineSource: ".js",
    }),
  ],
  resolve: {
    extensions: [".js"],
  },
};

export default config;
