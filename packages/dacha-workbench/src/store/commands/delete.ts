import { Command } from './command'

import type { DataValue } from '../types'

interface DeleteCommandOptions {
  path: string[]
}

export class DeleteCmd extends Command {
  execute(options: unknown): () => void {
    const { path } = options as DeleteCommandOptions

    let undoPath = path
    let undoValue = this.store.get(path) as DataValue

    if (path.length > 0) {
      const parentPath = path.slice(0, -1)
      const parent = this.store.get(parentPath)

      if (Array.isArray(parent)) {
        undoPath = parentPath
        undoValue = parent
      }
    }

    this.store.delete(path)

    return () => {
      this.store.set(undoPath, undoValue)
    }
  }
}
