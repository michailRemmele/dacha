const path = require('path')

const normalizePath = require('./normilize-path')

const getEditorConfig = () => {
  const config = require(path.resolve(process.env.EDITOR_CONFIG))

  return {
    ...config,
    projectConfig: normalizePath(config.projectConfig),
    assets: normalizePath(config.assets),
    systemsDir: normalizePath(config.systemsDir ?? 'src/systems'),
    componentsDir: normalizePath(config.componentsDir ?? 'src/components'),
    behaviorsDir: normalizePath(config.behaviorsDir ?? 'src/behaviors'),
    eventsEntry: normalizePath(config.eventsEntry ?? 'src/events/index.ts'),
    localesEntry: normalizePath(config.localesEntry ?? 'src/locales/index.ts'),
    libraries: config.libraries ?? [],
    formatWidgetNames: config.formatWidgetNames ?? true,
  }
}

module.exports = getEditorConfig
