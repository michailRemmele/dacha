export const PHYSICS_SETTINGS_PATH = [
  'globalOptions',
  'name:physics',
  'options',
];

export const COLLISION_LAYERS_PATH = [
  ...PHYSICS_SETTINGS_PATH,
  'collisionLayers',
];
export const COLLISION_MATRIX_PATH = [
  ...PHYSICS_SETTINGS_PATH,
  'collisionMatrix',
];

export const DEFAULT_LAYER_ID = 'default';

export const DEFAULT_LAYER = {
  id: DEFAULT_LAYER_ID,
  name: DEFAULT_LAYER_ID,
};
