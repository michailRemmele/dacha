const path = require('path')

const getSystemTemplate = require('./script-templates/get-system-template')
const getComponentTemplate = require('./script-templates/get-component-template')
const getBehaviorTemplate = require('./script-templates/get-behavior-template')
const normalizePath = require('./utils/normilize-path')

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
    templates: {
      system: config.templates?.system ?? getSystemTemplate,
      component: config.templates?.component ?? getComponentTemplate,
      behavior: config.templates?.behavior ?? getBehaviorTemplate,
    },
  }
}

module.exports = getEditorConfig
