const webpack = require('webpack');
const VirtualModulesPlugin = require('webpack-virtual-modules');

const getExtensionEntry = require('./electron/get-extension-entry');
const normalizePath = require('./electron/utils/normilize-path');
const baseConfig = require('./webpack.config');

module.exports = () => ({
  ...baseConfig,

  entry: {
    extension: normalizePath('./extension-entry.ts'),
  },

  output: {
    libraryTarget: 'umd',
    library: '[name]',
  },

  optimization: {
    sideEffects: false,
  },

  externals: [
    baseConfig.externals,
    function dachaWorkbench({ request }, callback) {
      if (
        request === 'dacha-workbench' ||
        request.startsWith('dacha-workbench/')
      ) {
        return callback(null, {
          commonjs: request,
          commonjs2: request,
          amd: request,
          root: ['DachaWorkbench', ...request.split('/').slice(1)],
        });
      }
      return callback();
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
