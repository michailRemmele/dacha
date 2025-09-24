import { Actor } from '../../../engine/actor';

const PATH_COMPONENTS = 'components';
const PATH_CHILDREN = 'children';

const _getValue = (
  actor: Actor,
  path: string[] | string,
  pathDepth: number,
): unknown => {
  let soughtValue: unknown = actor;

  for (let i = 0; i < pathDepth && soughtValue !== undefined; i += 1) {
    if (soughtValue instanceof Actor && path[i] === PATH_CHILDREN) {
      i += 1;
      soughtValue = soughtValue.children.find(
        (child) => child.name === path[i],
      );
    } else if (soughtValue instanceof Actor && path[i] === PATH_COMPONENTS) {
      i += 1;
      soughtValue = soughtValue.getComponent(path[i]);
    } else {
      soughtValue = (soughtValue as Record<string, unknown>)[path[i]];
    }
  }

  return soughtValue;
};

export const getValue = (actor: Actor, path: string[] | string): unknown =>
  _getValue(actor, path, path.length);

export const setValue = (
  actor: Actor,
  path: string[],
  value: unknown,
): void => {
  const soughtValue: unknown = _getValue(actor, path, path.length - 1);

  if (!soughtValue) {
    return;
  }
  if (soughtValue instanceof Actor) {
    throw new Error(
      `Can't set frame value for path: ${path.join('.')}. Setting value as actor property is restricted`,
    );
  }

  (soughtValue as Record<string, unknown>)[path[path.length - 1]] = value;
};
