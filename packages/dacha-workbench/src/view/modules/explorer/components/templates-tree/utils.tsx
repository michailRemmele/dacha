import type { LevelConfig, TemplateConfig, GameObjectConfig } from 'remiz'
import { FileOutlined } from '@ant-design/icons'

import { DataNodeWithPath } from '../../../../../types/tree-node'

const parseTemplate = (
  template: TemplateConfig,
  path: Array<string>,
): DataNodeWithPath => {
  const isLeaf = !template?.children?.length
  const templatePath = path.concat(`id:${template.id}`)

  const node: DataNodeWithPath = {
    key: template.id,
    title: template.name,
    path: templatePath,
    icon: <FileOutlined />,
    isLeaf,
  }

  if (!isLeaf) {
    const childPath = templatePath.concat('children')
    node.children = template.children?.map(
      (child) => parseTemplate(child, childPath),
    )
  }

  return node
}

export const parseTemplates = (
  templates: Array<TemplateConfig>,
): Array<DataNodeWithPath> => templates.map((template) => parseTemplate(template, ['templates']))

export const getKey = (entity?: unknown, path?: Array<string>): string | undefined => {
  if (!entity || !path) {
    return void ''
  }

  if (path[0] !== 'templates') {
    return void ''
  }

  return (entity as TemplateConfig).id
}

export const filterGameObjects = (
  gameObjects: Array<GameObjectConfig>,
  templateId: string,
): Array<GameObjectConfig> => gameObjects.reduce((acc, gameObject) => {
  if (gameObject.templateId !== templateId) {
    acc.push(gameObject)
  }

  if (gameObject.children !== undefined) {
    gameObject.children = filterGameObjects(gameObject.children, templateId)
  }

  return acc
}, [] as Array<GameObjectConfig>)

export const filterLevels = (
  levels: Array<LevelConfig>,
  templateId: string,
): Array<LevelConfig> => levels.map((level) => ({
  ...level,
  gameObjects: filterGameObjects(level.gameObjects, templateId),
}))
