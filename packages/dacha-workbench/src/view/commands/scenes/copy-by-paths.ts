import { v4 as uuidv4 } from 'uuid'
import type { SceneConfig } from 'dacha'

import type { ExplorerEntity } from '../../../types/explorer-entity'
import type { DispatchFn, GetStateFn } from '../../hooks/use-commander'
import { getUniqueName } from '../../../utils/get-unique-name'
import { addValues } from '..'
import { SCENES_PATH_LENGTH } from '../../../consts/paths'

const getDuplicate = (scene: SceneConfig, parent: SceneConfig[]): SceneConfig => {
  const duplicate = structuredClone(scene)
  duplicate.id = uuidv4()
  duplicate.name = getUniqueName(duplicate.name, parent as ExplorerEntity[])

  return duplicate
}

const isPathCorrect = (path: string[]): boolean => path.length === SCENES_PATH_LENGTH

export const copyByPaths = (
  sourcePaths: string[][],
  destinationPath: string[],
) => (
  dispatch: DispatchFn,
  getState: GetStateFn,
): void => {
  if (!isPathCorrect(destinationPath)) {
    return
  }

  const destination = getState(destinationPath)
  if (!Array.isArray(destination)) {
    return
  }

  const { values } = sourcePaths.reduce((acc, path) => {
    const value = getState(path)
    if (value) {
      const duplicate = getDuplicate(value as SceneConfig, acc.parent)

      acc.values.push(duplicate)
      acc.parent.push(duplicate)
    }
    return acc
  }, { values: [] as SceneConfig[], parent: destination.slice(0) as SceneConfig[] })

  if (values.length) {
    dispatch(addValues(destinationPath, values))
  }
}
