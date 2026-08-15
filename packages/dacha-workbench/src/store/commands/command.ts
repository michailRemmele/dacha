import type { Store } from '../store'

export abstract class Command {
  protected store: Store

  constructor(store: Store) {
    this.store = store
  }

  abstract execute(options: unknown): (() => void) | undefined
}
