import type { SceneConfig } from 'remiz'

import { DataNodeWithPath } from '../../../../../types/tree-node'

export const parseScenes = (
  scenes: Array<SceneConfig>,
): Array<DataNodeWithPath> => scenes.map((scene) => ({
  key: scene.name,
  title: scene.name,
  path: ['scenes', scene.name],
  isLeaf: true,
}))

export const getKey = (entity?: unknown, path?: Array<string>): string | undefined => {
  if (!entity || !path) {
    return void ''
  }

  if (path[0] !== 'scenes') {
    return void ''
  }

  return (entity as SceneConfig).name
}
