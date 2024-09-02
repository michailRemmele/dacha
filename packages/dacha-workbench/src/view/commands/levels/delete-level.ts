import { deleteValue } from '..'
import type { DispatchFn } from '../../hooks/use-commander'

export const deleteLevel = (
  path: Array<string>,
) => (
  dispatch: DispatchFn,
): void => {
  dispatch(deleteValue(path))
}
