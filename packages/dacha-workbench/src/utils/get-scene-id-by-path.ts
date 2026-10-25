import { SCENE_PATH_LENGTH } from '../consts/paths';

import { getIdByPath } from './get-id-by-path';

export const getSceneIdByPath = (path?: string[]): string | undefined => {
  if (
    path !== undefined &&
    path[0] === 'scenes' &&
    path.length >= SCENE_PATH_LENGTH
  ) {
    return getIdByPath(path.slice(0, SCENE_PATH_LENGTH));
  }
  return undefined;
};
