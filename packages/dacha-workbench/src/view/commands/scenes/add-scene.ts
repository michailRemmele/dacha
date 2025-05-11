import { v4 as uuidv4 } from 'uuid'
import i18next from 'i18next'
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
    id: uuidv4(),
    name: getUniqueName(i18next.t('explorer.scenes.actionBar.scene.new.title'), scenes),
    actors: [],
  }))
}
