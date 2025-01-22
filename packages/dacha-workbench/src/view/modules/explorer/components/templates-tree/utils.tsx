import type { LevelConfig, TemplateConfig, ActorConfig } from 'dacha'
import { FileOutlined } from '@ant-design/icons'

import { ExplorerDataNode } from '../../../../../types/tree-node'

const parseTemplate = (
  template: TemplateConfig,
  path: Array<string>,
  parent?: ExplorerDataNode,
): ExplorerDataNode => {
  const isLeaf = !template?.children?.length
  const templatePath = path.concat(`id:${template.id}`)

  const node: ExplorerDataNode = {
    key: template.id,
    title: template.name,
    path: templatePath,
    parent,
    icon: <FileOutlined />,
    isLeaf,
  }

  if (!isLeaf) {
    const childPath = templatePath.concat('children')
    node.children = template.children?.map(
      (child) => parseTemplate(child, childPath, node),
    )
  }

  return node
}

export const parseTemplates = (
  templates: Array<TemplateConfig>,
): Array<ExplorerDataNode> => templates.map((template) => parseTemplate(template, ['templates']))

export const getKey = (entity?: unknown, path?: Array<string>): string | undefined => {
  if (!entity || !path) {
    return void ''
  }

  if (path[0] !== 'templates') {
    return void ''
  }

  return (entity as TemplateConfig).id
}

export const filterActors = (
  actors: Array<ActorConfig>,
  templateId: string,
): Array<ActorConfig> => actors.reduce((acc, actor) => {
  if (actor.templateId !== templateId) {
    acc.push(actor)
  }

  if (actor.children !== undefined) {
    actor.children = filterActors(actor.children, templateId)
  }

  return acc
}, [] as Array<ActorConfig>)

export const filterLevels = (
  levels: Array<LevelConfig>,
  templateId: string,
): Array<LevelConfig> => levels.map((level) => ({
  ...level,
  actors: filterActors(level.actors, templateId),
}))
