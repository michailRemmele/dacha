import type { GameObject } from '../../../engine/gameObject';

export const getComponentValue = (
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
