import { Command } from './command'

import type { DataValue } from '../types'

interface AddValuesCommandOptions {
  path: string[]
  values: unknown
}

export class AddValuesCmd extends Command {
  execute(options: unknown): (() => void) | undefined {
    const { path } = options as AddValuesCommandOptions
    const values = (options as AddValuesCommandOptions).values as DataValue

    const array = this.store.get(path) as DataValue

    if (!Array.isArray(array)) {
      console.error('Can\'t add values to store. The item found by path should be an array')
      return undefined
    }

    this.store.set(
      path,
      Array.isArray(values) ? [...array, ...values] : [...array, values],
    )

    return () => {
      const modifiedArray = this.store.get(path) as DataValue[]
      this.store.set(path, modifiedArray.slice(0, Array.isArray(values) ? -values.length : -1))
    }
  }
}
