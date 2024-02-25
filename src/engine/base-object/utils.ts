import { Queue } from '../data-lib';

import type { BaseObject } from './base-object';

export const traverseObject = <T extends BaseObject>(
  object: T,
  callback: (object: T) => void,
): void => {
  const queue = new Queue<T>();
  queue.add(object);

  while (queue.peek() !== null) {
    const currentObject = queue.poll()!;

    callback(currentObject);

    currentObject.children.forEach((child) => {
      queue.add(child as T);
    });
  }
};

export const findObject = <T extends BaseObject>(
  object: T,
  predicate: (object: T) => boolean,
): T | undefined => {
  const queue = new Queue<T>();
  queue.add(object);

  while (queue.peek() !== null) {
    const currentObject = queue.poll()!;

    if (predicate(currentObject)) {
      return currentObject;
    }

    currentObject.children.forEach((child) => {
      queue.add(child as T);
    });
  }

  return undefined;
};
