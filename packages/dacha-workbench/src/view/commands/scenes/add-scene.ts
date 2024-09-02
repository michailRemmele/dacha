import { v4 as uuidv4 } from 'uuid'
import type { SceneConfig } from 'remiz'

import { addValue } from '..'
import type { DispatchFn } from '../../hooks/use-commander'

export const addScene = (
  path: Array<string>,
  name: string,
) => (
  dispatch: DispatchFn,
): void => {
  dispatch(addValue<SceneConfig>(path, {
    id: uuidv4(),
    name,
    systems: [],
    levelId: null,
  }))
}
