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

const fixActor = (actor, map) => {
  if (actor.templateId) {
    const { id, children } = map[actor.templateName]
    actor.templateId = id
    delete actor.templateName

    actor.children?.forEach((child) => fixActor(child, children))
  }
}

config.levels.forEach((level) => {
  level.actors.forEach((actor) => fixActor(actor, nameToIdMap))
})

fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
