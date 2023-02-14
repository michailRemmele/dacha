import { Command } from './command'

interface DeleteCommandOptions {
  path: Array<string>
}

export class DeleteCmd extends Command {
  execute(options: unknown): void {
    const { path } = options as DeleteCommandOptions

    this.store.delete(path)
  }
}
