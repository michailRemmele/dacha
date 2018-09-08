'use strict';

process.env.NODE_ENV = 'production';

const webpack = require('webpack');
const paths = require('./paths');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'none',

  entry: {
    app: paths.indexJs,
  },

  output: {
    path: paths.build,
    filename: '[name].[hash].js',
    library: '[name]',
  },

  watch: false,

  devtool: false,

  resolve: {
    alias: {
      resources: paths.resources,
    },
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
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.indexHtml,
    }),
    new ExtractTextPlugin({
      filename: '[name].[hash].css',
    }),
    new UglifyJsPlugin(),
    new CopyWebpackPlugin([
      {
        from: paths.public,
        to: paths.build,
        ignore: [ paths.indexHtml ],
      },
    ]),
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
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  autoprefixer({
                    browsers: [ 'ie >= 8', 'last 4 version' ],
                  }),
                ],
              },
            },
            {
              loader: 'sass-loader',
            },
          ],
          fallback: 'style-loader',
        }),
      },
      {
        test: /\.json$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'api/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(png|jp(e?)g|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[hash]-[name].[ext]',
            },
          },
        ],
      },
    ],
  },
};
