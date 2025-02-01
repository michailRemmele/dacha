import { DELETE_BY_PATHS } from '../../../command-types'
import type { DispatchFn } from '../../hooks/use-commander'

export const deleteByPaths = (paths: string[][], isEffect?: boolean) => (
  dispatch: DispatchFn,
): void => {
  if (!paths.length) {
    return
  }

  dispatch({
    command: DELETE_BY_PATHS,
    options: {
      paths,
    },
    isEffect,
  })
}
