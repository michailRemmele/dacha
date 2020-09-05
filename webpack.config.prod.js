'use strict';

process.env.NODE_ENV = 'production';

const webpack = require('webpack');
const paths = require('./paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SpriteSmithWebpackPlugin = require('./etc/webpack/plugins/spritesmith-webpack-plugin');

module.exports = {
  mode: 'none',

  entry: {
    app: paths.indexJs,
  },

  output: {
    path: paths.build,
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js',
    library: '[name]',
  },

  watch: false,

  devtool: false,

  resolve: {
    extensions: [ '.js', '.jsx' ],
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
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
    }),
    new UglifyJsPlugin(),
    new CopyWebpackPlugin([
      {
        from: paths.public,
        to: paths.build,
        ignore: [ paths.indexHtml, paths.graphicResources ],
      },
    ]),
    new SpriteSmithWebpackPlugin({
      input: {
        path: paths.graphicResources,
        pattern: '**/*.png',
      },
      output: {
        path: paths.build,
        spriteFilename: 'resources/textureAtlas.png',
        sourceMapFilename: 'resources/textureAtlasMap.json',
      },
      padding: 2,
    }),
  ],

  module: {
    rules: [
      {
        test: /\.js(x?)$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.(png|jp(e?)g)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[hash]-[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [ '@svgr/webpack' ],
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
    ],
  },
};
