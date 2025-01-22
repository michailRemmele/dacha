const webpack = require('webpack')
const path = require('path')

const baseConfig = require('./webpack.config')

module.exports = (entry) => ({
  ...baseConfig,

  entry: {
    extension: path.resolve(process.cwd(), entry),
  },

  output: {
    libraryTarget: 'umd',
    library: 'editorExtension',
  },

  externals: {
    ...baseConfig.externals,
    'dacha-workbench': 'DachaWorkbench',
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
})
