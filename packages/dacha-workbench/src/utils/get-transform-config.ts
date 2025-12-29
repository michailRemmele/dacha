import { type ComponentConfig, Transform, TransformConfig } from 'dacha';

export const getTransformConfig = (
  overrides?: TransformConfig,
): ComponentConfig => ({
  name: Transform.componentName,
  config: {
    offsetX: 0,
    offsetY: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    ...overrides,
  },
});
