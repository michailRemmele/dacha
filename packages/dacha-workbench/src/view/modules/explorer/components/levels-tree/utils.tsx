import type { LevelConfig, GameObjectConfig } from 'remiz'
import { FileOutlined } from '@ant-design/icons'

import type { ExplorerDataNode } from '../../../../../types/tree-node'

const parseGameObject = (
  gameObject: GameObjectConfig,
  path: Array<string>,
  parent?: ExplorerDataNode,
): ExplorerDataNode => {
  const isLeaf = !gameObject?.children?.length
  const gameObjectPath = path.concat(`id:${gameObject.id}`)

  const node: ExplorerDataNode = {
    key: gameObject.id,
    title: gameObject.name,
    path: gameObjectPath,
    parent,
    icon: <FileOutlined />,
    isLeaf,
  }

  if (!isLeaf) {
    const childPath = gameObjectPath.concat('children')
    node.children = gameObject.children?.map(
      (child) => parseGameObject(child, childPath, node),
    )
  }

  return node
}

export const parseLevels = (
  levels: Array<LevelConfig>,
  inactiveSelectedLevelId?: string,
): Array<ExplorerDataNode> => levels.map((level) => ({
  key: level.id,
  title: level.name,
  path: ['levels', `id:${level.id}`],
  children: level.gameObjects.map(
    (gameObject) => parseGameObject(gameObject, ['levels', `id:${level.id}`, 'gameObjects']),
  ),
  className: inactiveSelectedLevelId === level.id ? 'levels-tree__level_inactive' : undefined,
}))

export const getKey = (entity?: unknown, path?: Array<string>): string | undefined => {
  if (!entity || !path) {
    return void ''
  }

  if (path[0] !== 'levels') {
    return void ''
  }

  return (entity as GameObjectConfig | LevelConfig).id
}
