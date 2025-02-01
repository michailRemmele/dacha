import type { Animation } from 'dacha'

import type { DispatchFn, GetStateFn } from '../../../../../../../../hooks/use-commander'
import { addValues, deleteByPaths } from '../../../../../../../../commands'

export const getTransitionDuplicate = (
  transition: Animation.TransitionConfig,
): Animation.TransitionConfig => {
  const duplicate = structuredClone(transition)
  return duplicate
}

export const moveByPaths = (
  sourcePaths: string[][],
  destinationPath: string[],
) => (
  dispatch: DispatchFn,
  getState: GetStateFn,
): void => {
  const destination = getState(destinationPath)
  if (!Array.isArray(destination)) {
    return
  }

  const { values } = sourcePaths.reduce((acc, path) => {
    const value = getState(path)
    if (value) {
      const duplicate = getTransitionDuplicate(value as Animation.TransitionConfig)
      acc.values.push(duplicate)
    }
    return acc
  }, { values: [] as Animation.TransitionConfig[] })

  if (values.length) {
    dispatch(addValues(destinationPath, values))
    dispatch(deleteByPaths(sourcePaths, true))
  }
}
