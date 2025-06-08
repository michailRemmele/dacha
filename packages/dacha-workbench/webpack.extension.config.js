const fs = require('fs')
const fg = require('fast-glob')
const webpack = require('webpack')

const baseConfig = require('./webpack.config')

module.exports = (config) => {
  const { eventsEntry, localesEntry, libraries } = config

  const widgetEntries = fg.globSync([
    `${config.systemsDir}/**/*.ts`,
    `${config.componentsDir}/**/*.ts`,
    `${config.behaviorsDir}/**/*.ts`,
  ], { absolute: true })

  if (!widgetEntries.length
    && !fs.existsSync(eventsEntry)
    && !fs.existsSync(localesEntry)
    && !libraries.length
  ) {
    return undefined
  }

  const entry = {}

  if (widgetEntries.length) {
    entry.widgets = widgetEntries
  }
  if (fs.existsSync(eventsEntry)) {
    entry.events = eventsEntry
  }
  if (fs.existsSync(localesEntry)) {
    entry.locales = localesEntry
  }

  libraries.forEach((name) => {
    entry[`${name}__widgets`] = name
    entry[`${name}__events`] = `${name}/events`
    entry[`${name}__locales`] = `${name}/locales`
  })

  return {
    ...baseConfig,

    entry,

    output: {
      libraryTarget: 'umd',
      library: '[name]',
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
  }
}
