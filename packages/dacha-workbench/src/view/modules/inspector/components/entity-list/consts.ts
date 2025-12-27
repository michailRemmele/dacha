import { Transform } from 'dacha';

import type { EntityType } from './types';

export const CONFIG_KEY_MAP: Record<EntityType, string> = {
  component: 'config',
  system: 'options',
};

export const PATH_FIELD_MAP: Record<EntityType, string> = {
  component: 'components',
  system: 'systems',
};

export const NON_DELETABLE_MAP: Record<EntityType, string[]> = {
  component: [Transform.componentName],
  system: [],
};
