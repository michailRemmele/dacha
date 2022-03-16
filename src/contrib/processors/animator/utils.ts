import type { GameObject } from '../../../engine/gameObject';

// 'components.renderable.currentFrame'
// 'components.light.options.intensity'
// 'children.powerLight.components.light.options.intensity'
// 'children.powerLight.children.powerLightBox.components.collider.options.size'

export const getValue = (
  path: Array<string> | string,
  gameObject: GameObject,
): unknown => {
  const componentName = path[0];
  let soughtValue: unknown = gameObject.getComponent(componentName);

  for (let i = 1; i < path.length && soughtValue !== undefined; i += 1) {
    soughtValue = (soughtValue as Record<string, unknown>)[path[i]];
  }

  return soughtValue;
};

export const setValue = (path: Array<string>, gameObject: GameObject): void => {

};
