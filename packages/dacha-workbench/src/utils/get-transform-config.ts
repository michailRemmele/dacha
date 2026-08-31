import { type ComponentConfig, Transform, TransformConfig } from 'dacha';

export const getTransformConfig = (
  overrides?: TransformConfig,
): ComponentConfig => ({
  name: Transform.componentName,
  config: {
    offset: { x: 0, y: 0 },
    rotation: 0,
    scale: { x: 1, y: 1 },
    ...overrides,
  },
});
