type DataValue = string | number | boolean

interface DataNode {
  [key: string]: DataNode | Array<DataNode> | DataValue
}

export type Data = DataNode | Array<DataNode> | DataValue

const next = (data: Data, path: Array<string>, index = 0): unknown => {
  const key = path[index]

  if (!key) {
    return data
  }

  if (Array.isArray(data)) {
    const node = data.find((item) => item.name === key)

    if (node) {
      return next(node, path, index + 1)
    }
  } else if (typeof data === 'object') {
    return next(data[key], path, index + 1)
  }

  return void 0
}

export const get = (data: Data, path: Array<string>): unknown => next(data, path)
