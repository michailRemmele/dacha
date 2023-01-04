import type { Store } from '.'
import type { Data, DataValue, DataObjectValue } from './types'

export const findByName = (
  data: Array<DataValue>,
  name: string,
): DataValue | undefined => data.find((item) => typeof item === 'object' && !Array.isArray(item) && item.name === name)

export const findIndexByName = (
  data: Array<DataValue>,
  name: string,
): number => data.findIndex((item) => typeof item === 'object' && !Array.isArray(item) && item.name === name)

export const next = (
  data: DataValue | Data,
  path: Array<string>,
  index = 0,
): DataValue | Data | undefined => {
  const key = path[index]

  if (!key) {
    return data
  }

  if (Array.isArray(data)) {
    const node = findByName(data, key)

    if (node) {
      return next(node, path, index + 1)
    }
  } else if (typeof data === 'object') {
    return next(data[key], path, index + 1)
  }

  return void 0
}

export const nextImmutable = (
  data: DataValue | Data,
  path: Array<string>,
  parent: DataObjectValue | Array<DataValue> | Data | Store,
  parentKey: string | number,
  index = 0,
): DataValue | Data | undefined => {
  let copyData = data
  const key = path[index]

  if (Array.isArray(data)) {
    /* comment: Need to update all objects and arrays on the way to value */
    /* eslint-disable-next-line no-param-reassign */
    (parent as Data)[parentKey] = [...data]
  } else if (typeof data === 'object' && data !== null) {
    /* comment: Need to update all objects and arrays on the way to value */
    /* eslint-disable-next-line no-param-reassign */
    (parent as Data)[parentKey] = { ...data as DataObjectValue }
  }

  copyData = (parent as Data)[parentKey] as DataValue | Data

  if (!key) {
    return copyData
  }

  if (Array.isArray(copyData)) {
    const nodeIndex = findIndexByName(copyData, key)

    if (nodeIndex !== -1) {
      return nextImmutable(copyData[nodeIndex], path, copyData, nodeIndex, index + 1)
    }
  } else if (typeof copyData === 'object' && copyData !== null) {
    return nextImmutable(copyData[key], path, copyData, key, index + 1)
  }

  return void 0
}
