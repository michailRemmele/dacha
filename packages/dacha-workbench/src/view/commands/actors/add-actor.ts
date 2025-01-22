import { v4 as uuidv4 } from 'uuid'
import i18next from 'i18next'
import type { ActorConfig } from 'dacha'

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
    name: i18next.t('explorer.levels.actionBar.actor.new.title', { index: destination.length }),
    components: [],
    children: [],
  }))
}
