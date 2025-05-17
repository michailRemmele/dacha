import type { SceneConfig } from '../../../types';

export const getSceneConfigMock = (id: string): SceneConfig => ({
  id,
  name: id,
  actors: [],
});
