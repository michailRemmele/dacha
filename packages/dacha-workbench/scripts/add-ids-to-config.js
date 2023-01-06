const path = require('path')
const fs = require('fs')
const { program } = require('commander')
const { v4: uuidv4 } = require('uuid')

program
  .option('--config <string>')

program.parse()

const configPath = path.resolve(program.opts().config)
const configFile = fs.readFileSync(configPath)
const config = JSON.parse(configFile)

config.scenes.forEach((scene) => {
  scene.id = uuidv4()
})

config.loaders.forEach((loader) => {
  loader.id = uuidv4()
})

config.levels.forEach((level) => {
  level.id = uuidv4()
})

const addIdsToTemplate = (template) => {
  template.id = uuidv4()

  template.children?.forEach((child) => addIdsToTemplate(child))
}

config.templates.forEach((template) => addIdsToTemplate(template))

fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
