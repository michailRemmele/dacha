import type { TemplateConfig, SceneConfig } from 'dacha';

import type { ExplorerEntity } from '../../../types/explorer-entity';
import type { DispatchFn, GetStateFn } from '../../hooks/use-commander';
import { getUniqueName } from '../../../utils/get-unique-name';
import { getIdByPath } from '../../../utils/get-id-by-path';
import { addValues, setValue, deleteByPaths } from '..';

import { addChildActors, removeChildActors } from './utils';

const getParentId = (path: string[]): string | undefined =>
  path.at(-2) === 'children' ? getIdByPath(path.slice(0, -2)) : undefined;

const isInside = (path: string[], ancestor: string[]): boolean =>
  ancestor.every((part, index) => path[index] === part);

export const moveByPaths =
  (sourcePaths: string[][], destinationPath: string[]) =>
  (dispatch: DispatchFn, getState: GetStateFn): void => {
    const destination = getState(destinationPath);
    if (!Array.isArray(destination)) {
      return;
    }

    const parentId =
      destinationPath.at(-1) === 'children'
        ? getIdByPath(destinationPath.slice(0, -1))
        : undefined;

    const paths = sourcePaths.filter(
      (path) =>
        !isInside(destinationPath, path) && getParentId(path) !== parentId,
    );

    const siblings = (destination as TemplateConfig[]).slice(0);
    const values = paths.reduce((acc, path) => {
      const value = getState(path) as TemplateConfig | undefined;
      if (value) {
        const moved = structuredClone(value);
        moved.name = getUniqueName(moved.name, siblings as ExplorerEntity[]);
        acc.push(moved);
        siblings.push(moved);
      }
      return acc;
    }, [] as TemplateConfig[]);

    if (!values.length) {
      return;
    }

    let scenes = getState(['scenes']) as SceneConfig[];
    paths.forEach((path) => {
      const oldParentId = getParentId(path);
      if (oldParentId) {
        scenes = removeChildActors(
          scenes,
          oldParentId,
          new Set([getIdByPath(path)]),
        );
      }
    });
    if (parentId) {
      scenes = addChildActors(scenes, parentId, values);
    }

    dispatch(deleteByPaths(paths));
    dispatch(addValues(destinationPath, values, true));
    dispatch(setValue(['scenes'], scenes, true));
  };
