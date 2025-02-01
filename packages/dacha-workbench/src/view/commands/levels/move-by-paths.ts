import type { ExplorerEntity } from '../../../types/explorer-entity'
import type { DispatchFn, GetStateFn } from '../../hooks/use-commander'
import { getUniqueName } from '../../../utils/get-unique-name'
import { addValues, deleteByPaths } from '..'
import { LEVEL_PATH_LENGTH } from '../../../consts/paths'

const getDuplicate = (entity: unknown, parent: unknown): unknown => {
  const duplicate = structuredClone(entity as ExplorerEntity)
  duplicate.name = getUniqueName(duplicate.name, parent as ExplorerEntity[])

  return duplicate
}

const isPathCorrect = (path: string[], isActorDestination: boolean): boolean => {
  if (isActorDestination) {
    return path.length > LEVEL_PATH_LENGTH
  }
  return path.length === LEVEL_PATH_LENGTH
}

export const moveByPaths = (
  sourcePaths: string[][],
  destinationPath: string[],
) => (
  dispatch: DispatchFn,
  getState: GetStateFn,
): void => {
  const isActorDestination = destinationPath.at(-1) !== 'levels'
  const destination = getState(destinationPath)
  if (!Array.isArray(destination)) {
    return
  }

  const filteredPaths = sourcePaths.filter((path) => isPathCorrect(path, isActorDestination))

  const { values } = filteredPaths.reduce((acc, path) => {
    const value = getState(path)
    if (value) {
      const duplicate = getDuplicate(value, acc.parent)

      acc.values.push(duplicate)
      acc.parent.push(duplicate)
    }
    return acc
  }, { values: [] as unknown[], parent: destination.slice(0) })

  if (values.length) {
    dispatch(addValues(destinationPath, values))
    dispatch(deleteByPaths(filteredPaths, true))
  }
}
