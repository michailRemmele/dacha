'use strict';

process.env.NODE_ENV = 'production';

const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const paths = require('./paths');

module.exports = {
  mode: 'none',

  entry: {
    app: paths.indexTs,
  },

  output: {
    path: paths.build,
    filename: 'remiz.js',
    library: 'remiz',
    libraryTarget: 'commonjs2',
  },

  watch: false,

  devtool: false,

  optimization: {
    noEmitOnErrors: true,
    minimize: true,
    minimizer: [ new TerserPlugin() ],
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    }),
    new CleanWebpackPlugin([ paths.build ]),
  ],

  resolve: {
    extensions: ['.js', '.ts'],
    modules: [
      'node_modules',
    ],
  },

  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader'
          },
        ],
      },
    ],
  },
};
