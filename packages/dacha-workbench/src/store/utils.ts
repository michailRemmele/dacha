import type { Store } from './store';
import type { Data, DataValue, DataObjectValue } from './types';

const KEY_DELIMETER = ':';

const isObject = (value: unknown): value is DataObjectValue =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const findIndexByKey = (data: DataValue[], key: string): number => {
  const delimiterIndex = key.indexOf(KEY_DELIMETER);

  if (delimiterIndex === -1) {
    const index = Number(key);
    return Number.isInteger(index) && index >= 0 && index < data.length
      ? index
      : -1;
  }

  const name = key.slice(0, delimiterIndex);
  const value = key.slice(delimiterIndex + 1);

  return data.findIndex((item) => isObject(item) && item[name] === value);
};

export const findByKey = (
  data: DataValue[],
  key: string,
): DataValue | undefined => {
  const index = findIndexByKey(data, key);
  return index === -1 ? undefined : data[index];
};

// Writes `value` under `key` of an array or an object. In an array only an
// existing item is replaced. Returns whether anything changed.
export const setByKey = (
  container: DataValue | Data,
  key: string,
  value: DataValue,
): boolean => {
  if (Array.isArray(container)) {
    const index = findIndexByKey(container, key);
    if (index === -1) {
      return false;
    }
    container[index] = value;
    return true;
  }
  if (typeof container === 'object' && container !== null) {
    (container as Data)[key] = value;
    return true;
  }
  return false;
};

// Removes `key` from an array or an object. Returns whether anything changed.
export const deleteByKey = (
  container: DataValue | Data | undefined,
  key: string,
): boolean => {
  if (Array.isArray(container)) {
    const index = findIndexByKey(container, key);
    if (index === -1) {
      return false;
    }
    container.splice(index, 1);
    return true;
  }
  if (typeof container === 'object' && container !== null && key in container) {
    delete (container as Data)[key];
    return true;
  }
  return false;
};

export const get = (
  data: DataValue | Data,
  path: string[],
  index = 0,
): DataValue | Data | undefined => {
  const key = path[index];

  if (!key) {
    return data;
  }

  if (Array.isArray(data)) {
    const node = findByKey(data, key);

    if (node !== undefined) {
      return get(node, path, index + 1);
    }
  } else if (typeof data === 'object' && data !== null) {
    return get(data[key], path, index + 1);
  }

  return undefined;
};

export const getImmutable = (
  data: DataValue | Data,
  path: string[],
  parent?: DataObjectValue | DataValue[] | Data | Store,
  parentKey?: string | number,
  index = 0,
): DataValue | Data | undefined => {
  let copyData = data;
  const key = path[index];

  if (parent !== undefined && parentKey !== undefined) {
    if (Array.isArray(data)) {
      (parent as Data)[parentKey] = [...data];
    } else if (typeof data === 'object' && data !== null) {
      (parent as Data)[parentKey] = { ...(data as DataObjectValue) };
    }

    copyData = (parent as Data)[parentKey] as DataValue | Data;
  }

  if (!key) {
    return copyData;
  }

  if (Array.isArray(copyData)) {
    const nodeIndex = findIndexByKey(copyData, key);

    if (nodeIndex !== -1) {
      return getImmutable(
        copyData[nodeIndex],
        path,
        copyData,
        nodeIndex,
        index + 1,
      );
    }
  } else if (typeof copyData === 'object' && copyData !== null) {
    return getImmutable(copyData[key], path, copyData, key, index + 1);
  }

  return undefined;
};

export const getCommonPath = (paths: string[][]): string[] => {
  const commonPath: string[] = [];

  if (!paths.length) {
    return commonPath;
  }

  for (let i = 0; i < paths[0].length; i += 1) {
    const segment = paths[0][i];
    if (segment && paths.every((path) => path[i] === segment)) {
      commonPath.push(segment);
    } else {
      break;
    }
  }
  return commonPath;
};
