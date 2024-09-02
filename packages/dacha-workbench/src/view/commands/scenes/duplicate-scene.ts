import { v4 as uuidv4 } from 'uuid'
import i18next from 'i18next'
import type { SceneConfig } from 'remiz'

import { addValue } from '..'
import type { DispatchFn } from '../../hooks/use-commander'

const getDuplicate = (scene: SceneConfig): SceneConfig => {
  const duplicate = structuredClone(scene)
  duplicate.id = uuidv4()
  duplicate.name = `${duplicate.name} ${i18next.t('explorer.duplicate.appendix.title')}`

  return duplicate
}

export const duplicateScene = (
  path: Array<string>,
  scene: SceneConfig,
) => (
  dispatch: DispatchFn,
): void => {
  dispatch(addValue(
    path,
    getDuplicate(scene),
  ))
}
