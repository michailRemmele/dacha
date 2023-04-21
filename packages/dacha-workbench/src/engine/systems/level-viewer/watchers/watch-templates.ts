import type { TemplateConfig } from 'remiz'

import type { WatcherFn } from './types'

const TEMPLATE_PATH_LENGTH = 2

export const watchTemplates: WatcherFn = ({
  path,
  store,
  gameObjectObserver,
  gameObjectDestroyer,
  gameObjectCreator,
  gameObjectSpawner,
  templateCollection,
  level,
}): void => {
  const templatePath = path.slice(0, TEMPLATE_PATH_LENGTH)
  const template = store.get(templatePath) as TemplateConfig

  templateCollection?.delete(template.id)
  templateCollection?.register(template)

  if (!level) {
    return
  }

  const { gameObjects } = level

  gameObjects.forEach((gameObjectConfig) => {
    if (template.id !== gameObjectConfig.templateId) {
      return
    }

    const gameObject = gameObjectObserver.getById(gameObjectConfig.id)

    if (gameObject) {
      gameObjectDestroyer.destroy(gameObject)
      gameObjectSpawner.spawn(gameObjectCreator.create(gameObjectConfig))
    }
  })
}
