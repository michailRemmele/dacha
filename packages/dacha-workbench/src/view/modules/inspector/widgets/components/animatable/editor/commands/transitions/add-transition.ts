import { v4 as uuidv4 } from 'uuid'

import { getIdByPath } from '../../../../../../../../../utils/get-id-by-path'
import { getStatePath } from '../../utils/paths'
import { addValue } from '../../../../../../../../commands'
import type { DispatchFn } from '../../../../../../../../hooks/use-commander'

export const addTransition = (
  destinationPath: string[],
) => (
  dispatch: DispatchFn,
): void => {
  const statePath = getStatePath(destinationPath) as string[]
  const stateId = getIdByPath(statePath)

  dispatch(addValue(destinationPath, {
    id: uuidv4(),
    state: stateId,
    time: 0,
    conditions: [],
  }))
}
