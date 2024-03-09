import { Queue } from '../data-lib';

import type { Entity } from './entity';

export const traverseEntity = <T extends Entity>(
  entity: T,
  callback: (entity: T) => void,
): void => {
  const queue = new Queue<T>();
  queue.add(entity);

  while (queue.peek() !== null) {
    const currentEntity = queue.poll()!;

    callback(currentEntity);

    currentEntity.children.forEach((child) => {
      queue.add(child as T);
    });
  }
};

export const findEntity = <T extends Entity>(
  entity: T,
  predicate: (entity: T) => boolean,
): T | undefined => {
  const queue = new Queue<T>();
  queue.add(entity);

  while (queue.peek() !== null) {
    const currentEntity = queue.poll()!;

    if (predicate(currentEntity)) {
      return currentEntity;
    }

    currentEntity.children.forEach((child) => {
      queue.add(child as T);
    });
  }

  return undefined;
};
