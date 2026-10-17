import {
  get,
  getImmutable,
  getCommonPath,
  setByKey,
  deleteByKey,
} from './utils';
import type { Data, DataValue, ListenerFn } from './types';

export class Store {
  private data: Data;
  private listeners: ListenerFn[];

  constructor(data: Data) {
    this.data = data;
    this.listeners = [];
  }

  get(path: string[]): unknown {
    return get(this.data, path);
  }

  set(path: string[], value: DataValue): void {
    if (path.length === 0) {
      this.data = value as Data;
    } else {
      const parent = getImmutable(this.data, path.slice(0, -1), this, 'data');
      if (!parent || !setByKey(parent, path.at(-1) as string, value)) {
        return;
      }
    }

    this.listeners.forEach((listener) => listener(path, value));
  }

  delete(path: string[]): void {
    const parent = getImmutable(this.data, path.slice(0, -1), this, 'data');
    if (!deleteByKey(parent, path.at(-1) as string)) {
      return;
    }

    this.listeners.forEach((listener) => listener(path));
  }

  deleteByPaths(paths: string[][]): void {
    if (!paths.length) {
      return;
    }

    const commonPath = getCommonPath(paths);
    if (paths.some((path) => path.length === commonPath.length)) {
      commonPath.pop();
    }

    const subRoot = getImmutable(this.data, commonPath, this, 'data');
    if (!subRoot) {
      return;
    }

    for (const path of paths) {
      const parent = getImmutable(subRoot, path.slice(commonPath.length, -1));
      deleteByKey(parent, path.at(-1) as string);
    }

    this.listeners.forEach((listener) =>
      listener(commonPath, subRoot as DataValue),
    );
  }

  subscribe(listener: ListenerFn): () => void {
    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter(
        (currentListener) => currentListener !== listener,
      );
    };
  }
}
