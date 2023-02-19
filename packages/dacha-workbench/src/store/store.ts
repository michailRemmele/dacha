import {
  get,
  getImmutable,
  findIndexByKey,
} from './utils'
import type {
  Data,
  DataValue,
  ListenerFn,
} from './types'

export class Store {
  private data: Data
  private listeners: Array<ListenerFn>

  constructor(data: Data) {
    this.data = data
    this.listeners = []
  }

  get(path: Array<string>): unknown {
    return get(this.data, path)
  }

  set(path: Array<string>, value: DataValue): void {
    const item = getImmutable(this.data, path.slice(0, -1), this, 'data')

    if (typeof item !== 'object' || item === null) {
      return
    }

    const key = path[path.length - 1]

    if (Array.isArray(item)) {
      const index = findIndexByKey(item, key)
      if (index !== -1) {
        item[index] = value
      }
    } else {
      item[key] = value
    }

    this.listeners.forEach((listener) => listener(path, value))
  }

  delete(path: Array<string>): void {
    const item = getImmutable(this.data, path.slice(0, -1), this, 'data')

    if (typeof item !== 'object' || item === null) {
      return
    }

    const key = path[path.length - 1]

    if (Array.isArray(item)) {
      const index = findIndexByKey(item, key)
      if (index !== -1) {
        item.splice(index, 1)
      }
    } else {
      delete item[key]
    }

    this.listeners.forEach((listener) => listener(path))
  }

  subscribe(listener: ListenerFn): () => void {
    this.listeners.push(listener)

    return () => {
      this.listeners = this.listeners.filter((currentListener) => currentListener !== listener)
    }
  }
}
