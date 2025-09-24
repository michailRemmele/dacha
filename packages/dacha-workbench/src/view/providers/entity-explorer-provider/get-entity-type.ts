export type EntityType = 'actor' | 'template' | 'scene'

export const getEntityType = (path: string[] | undefined): EntityType | undefined => {
  if (path === undefined) {
    return undefined
  }
  if (path.length > 2 && path[0] === 'scenes') {
    return 'actor'
  }
  if (path[0] === 'templates') {
    return 'template'
  }
  if (path[0] === 'scenes') {
    return 'scene'
  }

  return undefined
}
