import { uuid } from '../../../utils/uuid'
import { t } from 'i18next'
import type { SceneConfig } from 'dacha'

import { getUniqueName } from '../../../utils/get-unique-name'
import { addValue } from '..'
import type { DispatchFn, GetStateFn } from '../../hooks/use-commander'

export const addScene = () => (
  dispatch: DispatchFn,
  getState: GetStateFn,
): void => {
  const scenes = getState(['scenes']) as SceneConfig[]

  dispatch(addValue<SceneConfig>(['scenes'], {
    id: uuid(),
    name: getUniqueName(t('explorer.scenes.actionBar.scene.new.title'), scenes),
    actors: [],
  }))
}
