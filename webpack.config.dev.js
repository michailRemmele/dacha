'use strict';

process.env.NODE_ENV = 'development';

const webpack = require('webpack');
const paths = require('./paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'none',

  entry: {
    app: paths.indexJs,
  },

  devServer: {
    contentBase: paths.public,
    watchContentBase: true,
    inline: true,
    open: true,
    historyApiFallback: true,
  },

  output: {
    path: paths.build,
    filename: '[name].[hash].js',
    library: '[name]',
    publicPath: '/',
  },

  watch: true,

  devtool: 'cheap-module-eval-source-map',

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
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.indexHtml,
    }),
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
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
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
