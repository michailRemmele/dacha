const path = require('path')
const fs = require('fs')
const { program } = require('commander')

program
  .option('--config <string>')

program.parse()

const configPath = path.resolve(program.opts().config)
const configFile = fs.readFileSync(configPath)
const config = JSON.parse(configFile)

const buildNameToIdMap = (template, map) => {
  map[template.name] = {
    id: template.id,
    children: {},
  }
  template.children?.forEach((child) => buildNameToIdMap(child, map[template.name].children))
}

const nameToIdMap = {}
config.templates.forEach((template) => buildNameToIdMap(template, nameToIdMap))

const fixGameObject = (gameObject, map) => {
  if (gameObject.fromTemplate) {
    const { id, children } = map[gameObject.templateName]
    gameObject.templateId = id
    delete gameObject.templateName

    gameObject.children?.forEach((child) => fixGameObject(child, children))
  }
}

config.levels.forEach((level) => {
  level.gameObjects.forEach((gameObject) => fixGameObject(gameObject, nameToIdMap))
})

fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
