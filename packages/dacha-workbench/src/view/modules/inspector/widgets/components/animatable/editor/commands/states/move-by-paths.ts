import type { Animation } from 'dacha'

import type { ExplorerEntity } from '../../../../../../../../../types/explorer-entity'
import type { DispatchFn, GetStateFn } from '../../../../../../../../hooks/use-commander'
import { getUniqueName } from '../../../../../../../../../utils/get-unique-name'
import { addValues, deleteByPaths } from '../../../../../../../../commands'

const getDuplicate = (entity: unknown, parent: ExplorerEntity[]): ExplorerEntity => {
  const duplicate = structuredClone(entity as ExplorerEntity)
  duplicate.name = getUniqueName(duplicate.name, parent)

  return duplicate
}

const isPathCorrect = (path: string[], isStateDestination: boolean): boolean => {
  if (isStateDestination) {
    return path.at(-2) === 'states'
  }
  return path.at(-2) === 'substates'
}

export const moveByPaths = (
  sourcePaths: string[][],
  destinationPath: string[],
) => (
  dispatch: DispatchFn,
  getState: GetStateFn,
): void => {
  const isStateDestination = destinationPath.at(-1) === 'states'
  const destination = getState(destinationPath)
  if (!Array.isArray(destination)) {
    return
  }

  const filteredPaths = sourcePaths.filter((path) => isPathCorrect(path, isStateDestination))

  const { values } = filteredPaths.reduce((acc, path) => {
    const value = getState(path)
    if (value) {
      const duplicate = getDuplicate(value as Animation.SubstateConfig, acc.parent)

      acc.values.push(duplicate)
      acc.parent.push(duplicate)
    }
    return acc
  }, { values: [] as unknown[], parent: destination.slice(0) as ExplorerEntity[] })

  if (values.length) {
    dispatch(addValues(destinationPath, values))
    dispatch(deleteByPaths(filteredPaths, true))
  }
}
