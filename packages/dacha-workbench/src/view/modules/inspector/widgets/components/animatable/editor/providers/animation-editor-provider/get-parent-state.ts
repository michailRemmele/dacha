import { getStatePath, getSubstatePath } from '../../utils/paths'

import { getEntityType } from './get-entity-type'

export const getParentState = (path?: string[]): string[] | undefined => {
  if (!path) {
    return undefined
  }

  const type = getEntityType(path)

  if (type === 'state' || type === 'substate') {
    return undefined
  }
  return getSubstatePath(path) ?? getStatePath(path)
}
