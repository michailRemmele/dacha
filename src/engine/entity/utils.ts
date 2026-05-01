import { Queue } from '../data-lib';

export const traverseEntity = <T extends { children: T[] }>(
  entity: T,
  callback: (entity: T) => void,
): void => {
  const queue = new Queue<T>();
  queue.add(entity);

  while (queue.peek() !== null) {
    const currentEntity = queue.poll()!;

    callback(currentEntity);

    currentEntity.children.forEach((child) => queue.add(child as T));
  }
};

export const findChild = <T extends { children: T[] }>(
  entity: T,
  predicate: (entity: T) => boolean,
  recursive = true,
): T | undefined => {
  if (!recursive) {
    return (entity.children as T[]).find((child) => predicate(child));
  }

  const queue = new Queue<T>();
  entity.children.forEach((child) => queue.add(child as T));

  while (queue.peek() !== null) {
    const currentEntity = queue.poll()!;

    if (predicate(currentEntity)) {
      return currentEntity;
    }

    currentEntity.children.forEach((child) => queue.add(child as T));
  }

  return undefined;
};
