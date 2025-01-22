import { v4 as uuidv4 } from 'uuid'
import i18next from 'i18next'
import type { SceneConfig } from 'dacha'

import { addValue } from '..'
import type { DispatchFn, GetStateFn } from '../../hooks/use-commander'

const getDuplicate = (scene: SceneConfig): SceneConfig => {
  const duplicate = structuredClone(scene)
  duplicate.id = uuidv4()
  duplicate.name = `${duplicate.name} ${i18next.t('explorer.duplicate.appendix.title')}`

  return duplicate
}

export const duplicateScene = (
  sourcePath: string[],
  destinationPath: string[],
) => (
  dispatch: DispatchFn,
  getState: GetStateFn,
): void => {
  const scene = getState(sourcePath) as SceneConfig

  dispatch(addValue(destinationPath, getDuplicate(scene)))
}
