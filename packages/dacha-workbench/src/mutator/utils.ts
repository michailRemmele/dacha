import type { Mutator } from '.'
import type { Data, DataValue, DataObjectValue } from './types'

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
    const node = data.find((item) => typeof item === 'object' && !Array.isArray(item) && item.name === key)

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
  parent: DataObjectValue | Array<DataValue> | Data | Mutator,
  parentKey: string | number,
  index = 0,
): DataValue | Data | undefined => {
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

  if (!key) {
    return (parent as Data)[parentKey]
  }

  if (Array.isArray(data)) {
    const nodeIndex = data.findIndex((item) => typeof item === 'object' && !Array.isArray(item) && item.name === key)

    if (nodeIndex !== -1) {
      return nextImmutable(data[nodeIndex], path, data, nodeIndex, index + 1)
    }
  } else if (typeof data === 'object' && data !== null) {
    return nextImmutable(data[key], path, data, key, index + 1)
  }

  return void 0
}
