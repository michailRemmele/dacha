import { v4 as uuidv4 } from 'uuid'
import type { LevelConfig } from 'remiz'

import { addValue } from '..'
import type { DispatchFn } from '../../hooks/use-commander'

export const addLevel = (name: string) => (
  dispatch: DispatchFn,
): void => {
  dispatch(addValue<LevelConfig>(['levels'], {
    id: uuidv4(),
    name,
    actors: [],
  }))
}
