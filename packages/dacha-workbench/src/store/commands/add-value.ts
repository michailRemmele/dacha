import { Command } from './command'

import type { DataValue } from '../types'

interface AddValueCommandOptions {
  path: string[]
  value: unknown
}

export class AddValueCmd extends Command {
  execute(options: unknown): (() => void) | undefined {
    const { path } = options as AddValueCommandOptions
    const value = (options as AddValueCommandOptions).value as DataValue

    const array = this.store.get(path) as DataValue

    if (!Array.isArray(array)) {
      console.error('Can\'t add value to store. The item found by path should be an array')
      return undefined
    }

    this.store.set(path, [...array, value])

    return () => {
      const modifiedArray = this.store.get(path) as DataValue[]
      this.store.set(path, modifiedArray.slice(0, -1))
    }
  }
}
