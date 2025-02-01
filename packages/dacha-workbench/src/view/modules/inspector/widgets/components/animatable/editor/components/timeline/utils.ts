import type { Animation } from 'dacha'

import { getIdByPath } from '../../../../../../../../../utils/get-id-by-path'
import { STATE_TYPE } from '../../const'

export const getSelectedPaths = (
  paths: string[][],
): string[][] => paths.filter((path) => path.at(-2) === 'frames')

export const getFramesPath = (
  state?: Animation.StateConfig,
  statePath?: string[],
  substatePath?: string[],
): string[] | undefined => {
  if (!statePath || !state) {
    return undefined
  }
  if (state.type === STATE_TYPE.INDIVIDUAL) {
    return statePath.concat('timeline', 'frames')
  }
  if (!substatePath) {
    return undefined
  }
  return substatePath.concat('timeline', 'frames')
}

export const getParentId = (
  path?: string[],
): string | undefined => (path ? getIdByPath(path.slice(0, -2)) : undefined)
