export type EntityType = 'level' | 'actor' | 'template' | 'scene' | 'loader'

export const getEntityType = (path: Array<string> | undefined): EntityType | undefined => {
  if (path === undefined) {
    return undefined
  }
  if (path.length === 2 && path[0] === 'levels') {
    return 'level'
  }
  if (path.length > 2 && path[0] === 'levels') {
    return 'actor'
  }
  if (path[0] === 'templates') {
    return 'template'
  }
  if (path[0] === 'scenes') {
    return 'scene'
  }
  if (path[0] === 'loaders') {
    return 'loader'
  }

  return undefined
}
