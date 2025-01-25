import { v4 as uuidv4 } from 'uuid'
import i18next from 'i18next'
import type { LevelConfig } from 'dacha'

import { getUniqueName } from '../../../utils/get-unique-name'
import { addValue } from '..'
import type { DispatchFn, GetStateFn } from '../../hooks/use-commander'

export const addLevel = () => (
  dispatch: DispatchFn,
  getState: GetStateFn,
): void => {
  const levels = getState(['levels']) as LevelConfig[]

  dispatch(addValue<LevelConfig>(['levels'], {
    id: uuidv4(),
    name: getUniqueName(i18next.t('explorer.levels.actionBar.level.new.title'), levels),
    actors: [],
  }))
}
