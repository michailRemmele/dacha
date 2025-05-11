import type { SceneConfig, ActorConfig } from 'dacha'
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

export const parseScenes = (
  scenes: SceneConfig[],
  inactiveSelectedSceneId?: string,
): Array<ExplorerDataNode> => scenes.map((scene) => {
  const node: ExplorerDataNode = {
    key: scene.id,
    title: scene.name,
    path: ['scenes', `id:${scene.id}`],
    className: inactiveSelectedSceneId === scene.id ? 'scenes-tree__scene_inactive' : undefined,
  }

  node.children = scene.actors.map(
    (actor) => parseActor(actor, ['scenes', `id:${scene.id}`, 'actors'], node),
  )

  return node
})

export const getInspectedKey = (path?: Array<string>): string | undefined => {
  if (!path || path[0] !== 'scenes') {
    return void ''
  }

  return getIdByPath(path)
}

export const getSelectedPaths = (paths: string[][]): string[][] => paths
  .filter((path) => path[0] === 'scenes')
