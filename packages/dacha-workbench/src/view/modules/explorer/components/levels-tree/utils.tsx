import React from 'react'
import type { LevelConfig, GameObjectConfig } from 'remiz'
import { FileOutlined } from '@ant-design/icons'

import { DataNodeWithPath } from '../../../../../types/tree-node'

const parseGameObject = (
  gameObject: GameObjectConfig,
  path: Array<string>,
): DataNodeWithPath => {
  const isLeaf = !gameObject?.children?.length
  const gameObjectPath = path.concat(gameObject.name)

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
): Array<DataNodeWithPath> => levels.map((level) => ({
  key: level.name,
  title: level.name,
  path: ['levels', level.name],
  children: level.gameObjects.map(
    (gameObject) => parseGameObject(gameObject, ['levels', level.name, 'gameObjects']),
  ),
}))

export const getKey = (entity?: unknown, path?: Array<string>): string | undefined => {
  if (!entity || !path) {
    return void ''
  }

  if (path[0] !== 'levels') {
    return void ''
  }

  if (path.length === 2) {
    return (entity as LevelConfig).name
  }

  return (entity as GameObjectConfig).id
}
