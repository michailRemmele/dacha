import { v4 as uuidv4 } from 'uuid'
import i18next from 'i18next'
import type { ActorConfig } from 'dacha'

import { getUniqueName } from '../../../utils/get-unique-name'
import { addValue } from '..'
import type { DispatchFn, GetStateFn } from '../../hooks/use-commander'

export const addActor = (
  destinationPath: string[],
) => (
  dispatch: DispatchFn,
  getState: GetStateFn,
): void => {
  const destination = getState(destinationPath) as ActorConfig[]

  dispatch(addValue<ActorConfig>(destinationPath, {
    id: uuidv4(),
    name: getUniqueName(i18next.t('explorer.levels.actionBar.actor.new.title'), destination),
    components: [],
    children: [],
  }))
}
