import type { LevelConfig, ActorConfig } from 'dacha'
import { FileOutlined } from '@ant-design/icons'

import type { ExplorerDataNode } from '../../../../../types/tree-node'
import { getIdByPath } from '../../../../../utils/get-id-by-path'

const parseActor = (
  actor: ActorConfig,
  path: Array<string>,
  parent?: ExplorerDataNode,
): ExplorerDataNode => {
  const isLeaf = !actor?.children?.length
  const actorPath = path.concat(`id:${actor.id}`)

  const node: ExplorerDataNode = {
    key: actor.id,
    title: actor.name,
    path: actorPath,
    parent,
    icon: <FileOutlined />,
    isLeaf,
  }

  if (!isLeaf) {
    const childPath = actorPath.concat('children')
    node.children = actor.children?.map(
      (child) => parseActor(child, childPath, node),
    )
  }

  return node
}

export const parseLevels = (
  levels: Array<LevelConfig>,
  inactiveSelectedLevelId?: string,
): Array<ExplorerDataNode> => levels.map((level) => {
  const node: ExplorerDataNode = {
    key: level.id,
    title: level.name,
    path: ['levels', `id:${level.id}`],
    className: inactiveSelectedLevelId === level.id ? 'levels-tree__level_inactive' : undefined,
  }

  node.children = level.actors.map(
    (actor) => parseActor(actor, ['levels', `id:${level.id}`, 'actors'], node),
  )

  return node
})

export const getInspectedKey = (path?: Array<string>): string | undefined => {
  if (!path || path[0] !== 'levels') {
    return void ''
  }

  return getIdByPath(path)
}

export const getSelectedPaths = (paths: string[][]): string[][] => paths
  .filter((path) => path[0] === 'levels')
