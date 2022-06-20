import React from 'react'
import type { DataNode } from 'antd/lib/tree'
import type { LevelConfig, GameObjectConfig } from 'remiz'
import { FileOutlined } from '@ant-design/icons'

export interface DataNodeWithPath extends DataNode {
  path: Array<string>
}

const parseGameObject = (
  gameObject: GameObjectConfig,
  level: string,
  path: Array<string>,
): DataNodeWithPath => {
  const isLeaf = !gameObject?.children?.length
  const gameObjectPath = path.concat(gameObject.name)

  const node: DataNodeWithPath = {
    key: `${level}-${gameObject.name}`,
    title: gameObject.name,
    path: gameObjectPath,
    icon: <FileOutlined />,
    isLeaf,
  }

  if (!isLeaf) {
    const childPath = gameObjectPath.concat('children')
    node.children = gameObject.children?.map(
      (child) => parseGameObject(child, level, childPath),
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
    (gameObject) => parseGameObject(gameObject, level.name, ['levels', level.name, 'gameObjects']),
  ),
}))
