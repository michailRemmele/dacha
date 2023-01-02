import { next, nextImmutable } from './utils'
import type { Data, DataValue, ListenerFn } from './types'

export class Mutator {
  private data: Data
  private listeners: Array<ListenerFn>

  constructor(data: Data) {
    this.data = data
    this.listeners = []
  }

  get(path: Array<string>): unknown {
    return next(this.data, path)
  }

  set(path: Array<string>, value: DataValue): void {
    const item = nextImmutable(this.data, path.slice(0, -1), this, 'data')

    if (typeof item !== 'object' || item === null) {
      return
    }

    const key = path[path.length - 1]

    if (Array.isArray(item)) {
      item[Number(key)] = value
    } else {
      item[key] = value
    }

    this.listeners.forEach((listener) => listener(path, value))
  }

  subscribe(listener: ListenerFn): () => void {
    this.listeners.push(listener)

    return () => {
      this.listeners = this.listeners.filter((currentListener) => currentListener !== listener)
    }
  }
}
