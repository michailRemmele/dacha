export type EntityType = 'state' | 'substate' | 'transition' | 'frame'

export const getEntityType = (path: string[] | undefined): EntityType | undefined => {
  if (path === undefined) {
    return undefined
  }
  if (path.at(-2) === 'states') {
    return 'state'
  }
  if (path.at(-2) === 'substates') {
    return 'substate'
  }
  if (path.at(-2) === 'transitions') {
    return 'transition'
  }
  if (path.at(-2) === 'frames') {
    return 'frame'
  }

  return undefined
}
