const webpack = require('webpack');
const VirtualModulesPlugin = require('webpack-virtual-modules');

const getExtensionEntry = require('./electron/get-extension-entry');
const normalizePath = require('./electron/utils/normilize-path');
const baseConfig = require('./webpack.base');

const SHARED_MODULES = {
  'dacha-workbench': ['DachaWorkbench'],
  dacha: ['Dacha'],
  'dacha/events': ['Dacha', 'events'],
  'pixi.js': ['PIXI'],
};

module.exports = () => ({
  ...baseConfig,

  entry: {
    extension: normalizePath('./extension-entry.ts'),
  },

  output: {
    libraryTarget: 'umd',
    library: '[name]',
    chunkFilename: 'extension.[id].js',
  },

  optimization: {
    sideEffects: false,
  },

  externals: [
    baseConfig.externals,
    function sharedModules({ request }, callback) {
      const root = SHARED_MODULES[request];
      if (!root) {
        return callback();
      }
      return callback(null, {
        commonjs: request,
        commonjs2: request,
        amd: request,
        root,
      });
    },
  ],

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new VirtualModulesPlugin({
      [normalizePath('./extension-entry.ts')]: getExtensionEntry(),
    }),
  ],
});
