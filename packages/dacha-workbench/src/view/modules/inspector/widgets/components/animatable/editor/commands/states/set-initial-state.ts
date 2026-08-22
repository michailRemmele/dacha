import { getIdByPath } from '../../../../../../../../../utils/get-id-by-path'
import { setValue } from '../../../../../../../../commands'
import type { DispatchFn } from '../../../../../../../../hooks/use-commander'

export const setInitialState = (
  statePath: string[],
) => (
  dispatch: DispatchFn,
): void => {
  dispatch(setValue(statePath.slice(0, -2).concat('initialState'), getIdByPath(statePath)))
}
