import { getIdByPath } from './get-id-by-path'

export const LEVEL_PATH_LEGTH = 2

export const getActorIdByPath = (path?: Array<string>): string | undefined => {
  if (path !== undefined && path[0] === 'levels' && path.length > LEVEL_PATH_LEGTH) {
    return getIdByPath(path)
  }
  return undefined
}
