import type { SceneConfig } from 'dacha'

import { ExplorerDataNode } from '../../../../../types/tree-node'

export const parseScenes = (
  scenes: Array<SceneConfig>,
  isLoaders?: boolean,
): Array<ExplorerDataNode> => scenes.map((scene) => ({
  key: scene.id,
  title: scene.name,
  path: [isLoaders ? 'loaders' : 'scenes', `id:${scene.id}`],
  isLeaf: true,
}))

export const getKey = (
  entity?: unknown,
  path?: Array<string>,
  isLoaders?: boolean,
): string | undefined => {
  if (!entity || !path) {
    return void ''
  }

  const rootPath = isLoaders ? 'loaders' : 'scenes'
  if (path[0] !== rootPath) {
    return void ''
  }

  return (entity as SceneConfig).id
}
