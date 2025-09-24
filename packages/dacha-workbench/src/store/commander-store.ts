import { Store } from './store'
import { commands } from './commands'
import type { Command } from './commands/command'
import type { Data, ListenerFn } from './types'

const HISTORY_SIZE = 100

interface HistoryOperationEffect {
  undo: () => void
  redo: () => void
}

interface HistoryOperation {
  undo: () => void
  redo: () => void
  effects: HistoryOperationEffect[]
}

interface CommandEvent {
  command: string
  scope: string
  isEffect?: boolean
  options: unknown
}

interface CommandControlEvent {
  scope: string
}

export class CommanderStore {
  private store: Store
  private commands: Record<string, Command>
  private undoHistory: Record<string, HistoryOperation[]>
  private redoHistory: Record<string, HistoryOperation[]>

  constructor(data: Data) {
    this.store = new Store(data)
    this.commands = Object.keys(commands).reduce((acc: Record<string, Command>, key) => {
      const SomeCommand = commands[key]
      acc[key] = new SomeCommand(this.store)

      return acc
    }, {})
    this.undoHistory = {}
    this.redoHistory = {}
  }

  get(path: string[]): unknown {
    return this.store.get(path)
  }

  subscribe(listener: ListenerFn): () => void {
    return this.store.subscribe(listener)
  }

  dispatch(event: CommandEvent): void {
    const {
      command,
      scope,
      isEffect,
      options,
    } = event

    const cmd = this.commands[command]

    if (!cmd) {
      return
    }

    const undo = cmd.execute(options)
    const redo = cmd.execute.bind(cmd, options)

    if (undo === undefined) {
      return
    }

    this.undoHistory[scope] ??= []

    if (isEffect && this.undoHistory[scope].length > 0) {
      const lastOperation = this.undoHistory[scope].at(-1) as HistoryOperation
      lastOperation.effects.push({ undo, redo })
      return
    }

    this.undoHistory[scope].push({ undo, redo, effects: [] })

    if (this.undoHistory[scope].length > HISTORY_SIZE) {
      this.undoHistory[scope].shift()
    }

    this.redoHistory[scope] = []
  }

  undo(event: CommandControlEvent): void {
    const { scope } = event

    if (this.undoHistory[scope]?.length > 0) {
      const operation = this.undoHistory[scope].pop() as HistoryOperation

      for (let j = operation.effects.length - 1; j >= 0; j -= 1) {
        operation.effects[j].undo()
      }

      operation.undo()

      this.redoHistory[scope].push(operation)
    }
  }

  redo(event: CommandControlEvent): void {
    const { scope } = event

    if (this.redoHistory[scope]?.length > 0) {
      const operation = this.redoHistory[scope].pop() as HistoryOperation

      operation.redo()
      operation.effects.forEach((effect) => effect.redo())

      this.undoHistory[scope].push(operation)
    }
  }

  clean(event: CommandControlEvent): void {
    const { scope } = event

    delete this.undoHistory[scope]
    delete this.redoHistory[scope]
  }
}
