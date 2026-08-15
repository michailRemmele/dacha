import { deleteByPaths } from '..';
import type { DispatchFn } from '../../hooks/use-commander';

export const deleteAssets =
  (paths: string[][]) =>
  (dispatch: DispatchFn): void => {
    dispatch(deleteByPaths(paths));
  };
