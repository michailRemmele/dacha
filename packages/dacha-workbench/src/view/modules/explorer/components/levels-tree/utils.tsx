import React from 'react'
import type { LevelConfig, GameObjectConfig } from 'remiz'
import { FileOutlined } from '@ant-design/icons'

import type { DataNodeWithPath } from '../../../../../types/tree-node'

const parseGameObject = (
  gameObject: GameObjectConfig,
  path: Array<string>,
): DataNodeWithPath => {
  const isLeaf = !gameObject?.children?.length
  const gameObjectPath = path.concat(`id:${gameObject.id}`)

  const node: DataNodeWithPath = {
    key: gameObject.id,
    title: gameObject.name,
    path: gameObjectPath,
    icon: <FileOutlined />,
    isLeaf,
  }

  if (!isLeaf) {
    const childPath = gameObjectPath.concat('children')
    node.children = gameObject.children?.map(
      (child) => parseGameObject(child, childPath),
    )
  }

  return node
}

export const parseLevels = (
  levels: Array<LevelConfig>,
  inactiveSelectedLevelId?: string,
): Array<DataNodeWithPath> => levels.map((level) => ({
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
