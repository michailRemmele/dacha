'use strict';

process.env.NODE_ENV = 'production';

const webpack = require('webpack');
const paths = require('./paths');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'none',

  entry: {
    app: paths.indexJs,
  },

  output: {
    path: paths.build,
    filename: 'flyer-engine.js',
    library: 'flyerEngine',
    libraryTarget: 'commonjs2',
  },

  watch: false,

  devtool: false,

  resolve: {
    extensions: [ '.js' ],
    modules: [
      'src',
      'node_modules',
    ],
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    }),
    new CleanWebpackPlugin([ paths.build ]),
    new UglifyJsPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
};
