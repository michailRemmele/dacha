const fs = require('fs')
const path = require('path')

const normalizePath = require('./utils/normilize-path')
const getEditorConfig = require('./utils/get-editor-config')

const getImportPath = (entry) => {
  const entryExt = path.extname(entry)
  return entryExt ? entry.slice(0, -entryExt.length) : entry
}

const hasExport = (exportName) => {
  try {
    return !!require.resolve(exportName, { paths: [normalizePath('./')] })
  } catch (err) {
    return false
  }
}

module.exports = () => {
  const {
    systems,
    components,
    behaviors,
    widgets,
    events,
    locales,
    libraries,
    contextRoot,
  } = getEditorConfig()

  const {
    widgets: libWidgets,
    events: libEvents,
    locales: libLocales,
  } = libraries.reduce((acc, name) => {
    if (hasExport(`${name}/widgets`)) {
      acc.widgets.push(name)
    }
    if (hasExport(`${name}/events`)) {
      acc.events.push(name)
    }
    if (hasExport(`${name}/locales`)) {
      acc.locales.push(name)
    }
    return acc
  }, { widgets: [], events: [], locales: [] })

  return `
    ${libWidgets.map((name) => `import '${name}/widgets';`).join('\n')}
    ${libLocales.map((name, index) => `import * as libLocales${index} from '${name}/locales';`).join('\n')}
    ${libEvents.map((name, index) => `import * as libEvents${index} from '${name}/events';`).join('\n')}
    ${libraries.map((name) => (`import '${name}';`)).join('\n')}
    ${fs.existsSync(normalizePath(locales)) ? `import * as locales from '${getImportPath(locales)}';` : ''}
    ${fs.existsSync(normalizePath(events)) ? `import * as events from '${getImportPath(events)}';` : ''}

    function importAll(r) {
      r.keys().forEach(r);
    }

    function isObject(item) {
      return item !== null && typeof item === 'object' && !Array.isArray(item);
    } 

    function deepMerge(target, source) {
      const output = { ...target };

      for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          const sourceValue = source[key];
          const targetValue = target[key];

          if (isObject(sourceValue) && isObject(targetValue)) {
            output[key] = deepMerge(targetValue, sourceValue);
          } else {
            output[key] = sourceValue;
          }
        }
      }

      return output;
    }

    ${widgets.map((regexp) => `importAll(require.context('${contextRoot}', true, ${regexp}));`).join('\n')}
    ${systems.map((regexp) => `importAll(require.context('${contextRoot}', true, ${regexp}));`).join('\n')}
    ${components.map((regexp) => `importAll(require.context('${contextRoot}', true, ${regexp}));`).join('\n')}
    ${behaviors.map((regexp) => `importAll(require.context('${contextRoot}', true, ${regexp}));`).join('\n')}

    export default {
      events: [
        ${fs.existsSync(normalizePath(events)) ? '...Object.values(events).filter((entry) => typeof entry === \'string\'),' : ''}
        ${libEvents.map((_, index) => `...Object.values(libEvents${index}).filter((entry) => typeof entry === 'string'),`)}
      ],
      locales: [${libLocales.map((_, index) => `libLocales${index}`).toString()}].reduce((acc, entry) => {
        if (entry) {
          return deepMerge(entry, acc);
        }

        return acc;
      }, ${fs.existsSync(normalizePath(locales)) ? 'locales' : '{}'}),
    };
  `
}
