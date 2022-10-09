type DataValue = string | number | boolean

interface DataNode {
  [key: string]: DataNode | Array<DataNode> | DataValue
}

export type Data = DataNode | Array<DataNode> | DataValue

export const get = (data: Data, path: Array<string>): unknown => {
  const key = path.shift()

  if (!key) {
    return data
  }

  if (Array.isArray(data)) {
    const node = data.find((item) => item.name === key)

    if (node) {
      return get(node, path)
    }
  } else if (typeof data === 'object') {
    return get(data[key], path)
  }

  return void 0
}
