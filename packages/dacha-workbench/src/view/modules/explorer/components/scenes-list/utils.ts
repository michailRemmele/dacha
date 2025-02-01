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

export const getSelectedPaths = (paths: string[][], isLoaders?: boolean): string[][] => {
  const rootPath = isLoaders ? 'loaders' : 'scenes'

  return paths
    .filter((path) => path[0] === rootPath)
}
