import { Command } from './command'

import type { DataValue } from '../types'

interface SetCommandOptions {
  path: string[]
  value: string | number | boolean
}

export class SetCmd extends Command {
  execute(options: unknown): () => void {
    const {
      path,
      value,
    } = options as SetCommandOptions

    const oldValue = this.store.get(path) as DataValue
    this.store.set(path, value)

    return () => {
      this.store.set(path, oldValue)
    }
  }
}
