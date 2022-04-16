import { Entity } from '../../../engine/entity';

const PATH_COMPONENTS = 'components';
const PATH_CHILDREN = 'children';

// eslint-disable-next-line @typescript-eslint/naming-convention
const _getValue = (
  entity: Entity,
  path: Array<string> | string,
  pathDepth: number,
): unknown => {
  let soughtValue: unknown = entity;

  for (let i = 0; i < pathDepth && soughtValue !== undefined; i += 1) {
    if (soughtValue instanceof Entity && path[i] === PATH_CHILDREN) {
      i += 1;
      soughtValue = soughtValue.getChildByName(path[i]);
    } else if (soughtValue instanceof Entity && path[i] === PATH_COMPONENTS) {
      i += 1;
      soughtValue = soughtValue.getComponent(path[i]);
    } else {
      soughtValue = (soughtValue as Record<string, unknown>)[path[i]];
    }
  }

  return soughtValue;
};

export const getValue = (
  entity: Entity,
  path: Array<string> | string,
): unknown => _getValue(entity, path, path.length);

export const setValue = (entity: Entity, path: Array<string>, value: unknown): void => {
  const soughtValue: unknown = _getValue(entity, path, path.length - 1);

  if (!soughtValue) {
    throw new Error(`Can't set frame value for path: ${path.join('.')}. Make sure that path is correct`);
  }
  if (soughtValue instanceof Entity) {
    throw new Error(`Can't set frame value for path: ${path.join('.')}. Setting value as game object property is restricted`);
  }

  (soughtValue as Record<string, unknown>)[path[path.length - 1]] = value;
};
