const path = require('path')

const normalizePath = require('./normilize-path')

const getEditorConfig = () => {
  const config = require(path.resolve(process.env.EDITOR_CONFIG))

  return {
    ...config,
    projectConfig: normalizePath(config.projectConfig),
    assets: normalizePath(config.assets),
    contextRoot: config.contextRoot ?? './src',
    systems: config.systems ?? [/\.system\.ts$/],
    components: config.components ?? [/\.component\.ts$/],
    behaviors: config.behaviors ?? [/\.behavior\.ts$/],
    widgets: config.widgets ?? [/\.widget\.(ts|js|tsx|jsx)$/],
    events: config.events ?? './src/events/index.ts',
    locales: config.locales ?? './src/locales/index.ts',
    libraries: config.libraries ?? [],
    formatWidgetNames: config.formatWidgetNames ?? true,
  }
}

module.exports = getEditorConfig
