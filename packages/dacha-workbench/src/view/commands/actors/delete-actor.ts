import { deleteValue } from '..'
import type { DispatchFn } from '../../hooks/use-commander'

export const deleteActor = (
  path: Array<string>,
) => (
  dispatch: DispatchFn,
): void => {
  dispatch(deleteValue(path))
}
