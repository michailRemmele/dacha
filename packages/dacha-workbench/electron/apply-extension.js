const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')

const getWebpackConfig = require('../webpack.extension.config')

const MESSAGES = require('./messages')

const applyExtension = (app, window) => {
  const compiler = webpack(getWebpackConfig())

  compiler.hooks.compile.tap('ExtensionBuldStart', () => {
    window.webContents.send(MESSAGES.EXTENSION_BUILD_START)
  })

  let lastHash
  compiler.hooks.afterDone.tap('ExtensionBuildEnd', (stats) => {
    window.webContents.send(MESSAGES.EXTENSION_BUILD_END)

    if (lastHash === undefined) {
      lastHash = stats.hash
      return
    }

    if (lastHash !== stats.hash) {
      lastHash = stats.hash
      window.webContents.send(MESSAGES.NEEDS_UPDATE)
    }
  })

  app.use(
    middleware(compiler),
  )
}

module.exports = applyExtension
