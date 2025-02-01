import { v4 as uuidv4 } from 'uuid'

import { addValue } from '../../../../../../../../commands'
import type { DispatchFn } from '../../../../../../../../hooks/use-commander'

export const addFrame = (
  destinationPath: string[],
) => (
  dispatch: DispatchFn,
): void => {
  dispatch(addValue(destinationPath, {
    id: uuidv4(),
    fields: [],
  }))
}
