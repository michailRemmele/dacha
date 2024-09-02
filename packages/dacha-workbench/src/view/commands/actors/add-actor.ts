import { v4 as uuidv4 } from 'uuid'
import type { ActorConfig } from 'remiz'

import { addValue } from '..'
import type { DispatchFn } from '../../hooks/use-commander'

export const addActor = (
  path: Array<string>,
  name: string,
) => (
  dispatch: DispatchFn,
): void => {
  dispatch(addValue<ActorConfig>(path, {
    id: uuidv4(),
    name,
    components: [],
    children: [],
  }))
}
