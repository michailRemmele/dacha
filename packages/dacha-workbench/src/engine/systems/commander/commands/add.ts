import { Command } from './command'

import type { DataValue } from '../../../../store/types'

interface AddCommandOptions {
  path: Array<string>
  value: string | number | boolean
}

export class AddCmd extends Command {
  execute(options: unknown): (() => void) | void {
    const {
      path,
      value,
    } = options as AddCommandOptions

    const array = this.store.get(path) as DataValue

    if (!Array.isArray(array)) {
      console.error('Can\'t add value to store. The item found by path should be an array')
      return undefined
    }

    this.store.set(path, [...array, value])

    return () => {
      const modifiedArray = this.store.get(path) as Array<DataValue>
      this.store.set(path, modifiedArray.slice(0, -1))
    }
  }
}
