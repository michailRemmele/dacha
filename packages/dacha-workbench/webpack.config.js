const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const baseConfig = require('./webpack.base');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  ...baseConfig,

  entry: {
    app: path.resolve(__dirname, 'src/app.tsx'),
  },

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
  },

  devServer: {
    hot: true,
    static: {
      directory: path.join(__dirname, 'public'),
    },
  },

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    isDev ? null : new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, 'public/index.html'),
      chunks: ['app'],
    }),
    isDev
      ? null
      : new CopyWebpackPlugin({
          patterns: [
            {
              from: path.join(__dirname, 'public'),
              globOptions: {
                ignore: ['**/index.html'],
              },
            },
          ],
        }),
  ].filter(Boolean),
};
