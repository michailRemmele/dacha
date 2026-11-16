import type { SceneConfig } from 'dacha';

import { setValue, deleteByPaths } from '..';
import { getIdByPath } from '../../../utils/get-id-by-path';
import type { DispatchFn, GetStateFn } from '../../hooks/use-commander';

import { removeActors } from './utils';

export const deleteTemplates =
  (paths: string[][]) =>
  (dispatch: DispatchFn, getState: GetStateFn): void => {
    const templateIds = new Set(paths.map((path) => getIdByPath(path)));
    const scenes = getState(['scenes']) as SceneConfig[];

    dispatch(setValue(['scenes'], removeActors(scenes, templateIds)));
    dispatch(deleteByPaths(paths, true));
  };
