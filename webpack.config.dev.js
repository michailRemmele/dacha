'use strict';

process.env.NODE_ENV = 'development';

const webpack = require('webpack');
const paths = require('./paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SpriteSmithWebpackPlugin = require('./etc/webpack/plugins/spritesmith-webpack-plugin');
const DirWatchWebpackPlugin = require('./etc/webpack/plugins/dir-watch-webpack-plugin');

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
    host: '0.0.0.0',
  },

  output: {
    path: paths.build,
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js',
    library: '[name]',
    publicPath: '/',
  },

  watch: true,

  devtool: 'cheap-module-eval-source-map',

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
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.indexHtml,
    }),
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
    new DirWatchWebpackPlugin({
      path: paths.resources,
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
