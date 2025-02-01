import { v4 as uuidv4 } from 'uuid'
import type { Animation } from 'dacha'

import type { ExplorerEntity } from '../../../../../../../../../types/explorer-entity'
import type { DispatchFn, GetStateFn } from '../../../../../../../../hooks/use-commander'
import { getUniqueName } from '../../../../../../../../../utils/get-unique-name'
import { addValues } from '../../../../../../../../commands'

const getStateDuplicate = (
  state: Animation.StateConfig,
  parent: ExplorerEntity[],
): Animation.StateConfig => {
  const duplicate = structuredClone(state)
  duplicate.id = uuidv4()
  duplicate.name = getUniqueName(duplicate.name, parent)

  if (duplicate.type === 'group') {
    (duplicate as Animation.GroupStateConfig).substates.forEach((substate) => {
      substate.id = uuidv4()
    })
  }

  return duplicate
}

const getSubstateDuplicate = (
  substate: Animation.SubstateConfig,
  parent: ExplorerEntity[],
): Animation.SubstateConfig => {
  const duplicate = structuredClone(substate)
  duplicate.id = uuidv4()
  duplicate.name = getUniqueName(duplicate.name, parent)

  return duplicate
}

const isPathCorrect = (path: string[], isStateDestination: boolean): boolean => {
  if (isStateDestination) {
    return path.at(-2) === 'states'
  }
  return path.at(-2) === 'substates'
}

export const copyByPaths = (
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

  const { values } = sourcePaths.reduce((acc, path) => {
    if (!isPathCorrect(path, isStateDestination)) {
      return acc
    }
    const value = getState(path)
    if (value) {
      const duplicate = isStateDestination
        ? getStateDuplicate(value as Animation.StateConfig, acc.parent)
        : getSubstateDuplicate(value as Animation.SubstateConfig, acc.parent)

      acc.values.push(duplicate)
      acc.parent.push(duplicate)
    }
    return acc
  }, { values: [] as unknown[], parent: destination.slice(0) as ExplorerEntity[] })

  if (values.length) {
    dispatch(addValues(destinationPath, values))
  }
}
