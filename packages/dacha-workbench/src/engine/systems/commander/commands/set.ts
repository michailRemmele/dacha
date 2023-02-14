import { Command } from './command'

interface SetCommandOptions {
  path: Array<string>
  value: string | number | boolean
}

export class SetCmd extends Command {
  execute(options: unknown): void {
    const {
      path,
      value,
    } = options as SetCommandOptions

    this.store.set(path, value)
  }
}
