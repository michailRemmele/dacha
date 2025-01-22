import type { DispatchFn } from '../../hooks/use-commander'
import { moveByPaths as moveByPathsBase } from '..'
import { LEVELS_PATH_LEGTH } from '../../../consts/paths'

export const moveByPaths = (
  sourcePaths: string[][],
  destinationPath: string[],
) => (
  dispatch: DispatchFn,
): void => {
  const isActorDestination = destinationPath.at(-1) !== 'levels'

  const filteredSourcePaths = isActorDestination
    ? sourcePaths.filter((path) => path.length > LEVELS_PATH_LEGTH)
    : sourcePaths.filter((path) => path.length === LEVELS_PATH_LEGTH)

  dispatch(moveByPathsBase(
    filteredSourcePaths,
    destinationPath,
  ))
}
