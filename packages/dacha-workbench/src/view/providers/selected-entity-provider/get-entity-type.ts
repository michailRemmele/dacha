export type EntityType = 'level' | 'gameObject' | 'template' | 'scene'

export const getEntityType = (path: Array<string>): EntityType | undefined => {
  if (path.length === 2 && path[0] === 'levels') {
    return 'level'
  }
  if (path.length > 2 && path[0] === 'levels') {
    return 'gameObject'
  }
  if (path[0] === 'templates') {
    return 'template'
  }
  if (path[0] === 'scenes') {
    return 'scene'
  }

  return void ''
}
