import { Command } from './command'

interface UpdateFieldValueCommandOptions {
  path: Array<string>
  value: string | number | boolean
}

export class UpdateFieldValueCmd extends Command {
  execute(options: unknown): void {
    const {
      path,
      value,
    } = options as UpdateFieldValueCommandOptions

    this.store.set(path, value)
  }
}
