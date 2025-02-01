import { Command } from './command'

import { getCommonPath } from '../utils'
import type { DataValue } from '../types'

interface DeleteByPathsCommandOptions {
  paths: string[][]
}

export class DeleteByPathsCmd extends Command {
  execute(options: unknown): () => void {
    const { paths } = options as DeleteByPathsCommandOptions
    const commonPath = getCommonPath(paths)

    let undoPath = commonPath
    let undoValue = this.store.get(commonPath) as DataValue

    if (commonPath.length > 0) {
      const parentPath = commonPath.slice(0, -1)
      const parent = this.store.get(parentPath)

      if (Array.isArray(parent)) {
        undoPath = parentPath
        undoValue = parent
      }
    }

    this.store.deleteByPaths(paths)

    return () => {
      this.store.set(undoPath, undoValue)
    }
  }
}
