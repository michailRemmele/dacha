import { Command } from './command'

import type { DataValue } from '../types'

interface MoveByPathsCommandOptions {
  sourcePaths: string[][]
  destinationPath: string[]
  transformCallback?: (value: unknown, path: string[], parent: unknown) => DataValue
}

export class MoveByPathsCmd extends Command {
  execute(options: unknown): (() => void) | void {
    const {
      sourcePaths,
      destinationPath,
      transformCallback,
    } = options as MoveByPathsCommandOptions

    const destination = this.store.get(destinationPath) as DataValue

    if (typeof destination !== 'object' || destination === null) {
      console.error('Can\'t copy values by paths. The destination should be an array or object')
      return undefined
    }

    const undoParents = sourcePaths.map((path) => this.store.get(path.slice(0, -1)))

    this.store.moveByPaths(sourcePaths, destinationPath, transformCallback)

    return () => {
      sourcePaths.forEach((path, index) => {
        this.store.set(path.slice(0, -1), undoParents[index] as DataValue)
      })

      this.store.set(destinationPath, destination)
    }
  }
}
