import { Command } from './command'

import type { DataValue } from '../types'

interface CopyByPathsCommandOptions {
  sourcePaths: string[][]
  destinationPath: string[]
  transformCallback?: (value: unknown, path: string[], parent: unknown) => DataValue
}

export class CopyByPathsCmd extends Command {
  execute(options: unknown): (() => void) | void {
    const {
      sourcePaths,
      destinationPath,
      transformCallback,
    } = options as CopyByPathsCommandOptions

    const destination = this.store.get(destinationPath) as DataValue

    if (typeof destination !== 'object' || destination === null) {
      console.error('Can\'t copy values by paths. The destination should be an array or object')
      return undefined
    }

    this.store.copyByPaths(sourcePaths, destinationPath, transformCallback)

    return () => {
      this.store.set(destinationPath, destination)
    }
  }
}
