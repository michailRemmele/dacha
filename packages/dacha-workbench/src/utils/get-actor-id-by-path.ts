import { getIdByPath } from './get-id-by-path'

export const SCENE_PATH_LEGTH = 2

export const getActorIdByPath = (path?: string[]): string | undefined => {
  if (path !== undefined && path[0] === 'scenes' && path.length > SCENE_PATH_LEGTH) {
    return getIdByPath(path)
  }
  return undefined
}
