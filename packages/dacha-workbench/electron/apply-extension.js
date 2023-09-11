const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')

const getExtensionWebpackConfig = require('../webpack.extension.config')

const MESSAGES = require('./messages')

const applyExtension = (entry, app, window) => {
  const compiler = webpack(getExtensionWebpackConfig(entry))

  let isInitialBuild = true
  compiler.hooks.afterDone.tap('extensionWatcher', () => {
    if (isInitialBuild) {
      isInitialBuild = false
    } else {
      window.webContents.send(MESSAGES.NEEDS_RELOAD)
    }
  })

  app.use(
    middleware(compiler),
  )
}

module.exports = applyExtension
