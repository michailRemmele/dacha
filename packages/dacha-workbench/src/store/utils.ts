import type { Store } from './store'
import type { Data, DataValue, DataObjectValue } from './types'

const KEY_DELIMETER = ':'

const getFieldValue = (value: DataValue, name: string): DataValue | undefined => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return void ''
  }

  return value[name]
}

export const findByKey = (
  data: DataValue[],
  key: string,
): DataValue | undefined => {
  const [name, value] = key.split(KEY_DELIMETER)

  if (value === void 0) {
    return data[Number(name)]
  }

  return data.find((item) => getFieldValue(item, name) === value)
}

export const findIndexByKey = (
  data: DataValue[],
  key: string,
): number => {
  const [name, value] = key.split(KEY_DELIMETER)

  if (value === void 0) {
    return Number(name)
  }

  return data.findIndex((item) => getFieldValue(item, name) === value)
}

export const get = (
  data: DataValue | Data,
  path: string[],
  index = 0,
): DataValue | Data | undefined => {
  const key = path[index]

  if (!key) {
    return data
  }

  if (Array.isArray(data)) {
    const node = findByKey(data, key)

    if (node !== void 0) {
      return get(node, path, index + 1)
    }
  } else if (typeof data === 'object') {
    return get(data[key], path, index + 1)
  }

  return void 0
}

export const getImmutable = (
  data: DataValue | Data,
  path: string[],
  parent?: DataObjectValue | DataValue[] | Data | Store,
  parentKey?: string | number,
  index = 0,
): DataValue | Data | undefined => {
  let copyData = data
  const key = path[index]

  if (parent !== undefined && parentKey !== undefined) {
    if (Array.isArray(data)) {
      /* comment: Need to update all objects and arrays on the way to value */
       
      (parent as Data)[parentKey] = [...data]
    } else if (typeof data === 'object' && data !== null) {
      /* comment: Need to update all objects and arrays on the way to value */
       
      (parent as Data)[parentKey] = { ...data as DataObjectValue }
    }

    copyData = (parent as Data)[parentKey] as DataValue | Data
  }

  if (!key) {
    return copyData
  }

  if (Array.isArray(copyData)) {
    const nodeIndex = findIndexByKey(copyData, key)

    if (nodeIndex !== -1) {
      return getImmutable(copyData[nodeIndex], path, copyData, nodeIndex, index + 1)
    }
  } else if (typeof copyData === 'object' && copyData !== null) {
    return getImmutable(copyData[key], path, copyData, key, index + 1)
  }

  return void 0
}

export const getCommonPath = (paths: string[][]): string[] => {
  const commonPath: string[] = []

  if (!paths.length) {
    return commonPath
  }

  for (let i = 0; i < paths[0].length; i += 1) {
    const segment = paths[0][i]
    if (segment && paths.every((path) => path[i] === segment)) {
      commonPath.push(segment)
    } else {
      break
    }
  }
  return commonPath
}
