import { System } from 'remiz'
import type {
  Scene,
  SystemOptions,
} from 'remiz'

import { EventType } from '../../../events'
import type {
  CommandEvent,
  CommandUndoEvent,
  CommandRedoEvent,
  CommandCleanEvent,
} from '../../../events'
import type { Store } from '../../../store'

import { commands } from './commands'
import { Command } from './commands/command'

const HISTORY_SIZE = 100

interface HistoryOperationEffect {
  undo: () => void
  redo: () => void
}

interface HistoryOperation {
  undo: () => void
  redo: () => void
  effects: Array<HistoryOperationEffect>
}

export class Commander extends System {
  private scene: Scene
  private configStore: Store
  private commands: Record<string, Command>
  private undoHistory: Record<string, Array<HistoryOperation>>
  private redoHistory: Record<string, Array<HistoryOperation>>

  constructor(options: SystemOptions) {
    super()

    const { scene } = options

    this.scene = scene
    this.configStore = scene.data.configStore as Store
    this.commands = Object.keys(commands).reduce((acc: Record<string, Command>, key) => {
      const SomeCommand = commands[key]
      acc[key] = new SomeCommand(this.configStore)

      return acc
    }, {})
    this.undoHistory = {}
    this.redoHistory = {}
  }

  mount(): void {
    this.scene.addEventListener(EventType.Command, this.handleCommand)
    this.scene.addEventListener(EventType.CommandUndo, this.handleCommandUndo)
    this.scene.addEventListener(EventType.CommandRedo, this.handleCommandRedo)
    this.scene.addEventListener(EventType.CommandClean, this.handleCommandClean)
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.Command, this.handleCommand)
    this.scene.removeEventListener(EventType.CommandUndo, this.handleCommandUndo)
    this.scene.removeEventListener(EventType.CommandRedo, this.handleCommandRedo)
    this.scene.removeEventListener(EventType.CommandClean, this.handleCommandClean)
  }

  private handleCommand = (event: CommandEvent): void => {
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

  private handleCommandUndo = (event: CommandUndoEvent): void => {
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

  private handleCommandRedo = (event: CommandRedoEvent): void => {
    const { scope } = event

    if (this.redoHistory[scope]?.length > 0) {
      const operation = this.redoHistory[scope].pop() as HistoryOperation

      operation.redo()
      operation.effects.forEach((effect) => effect.redo())

      this.undoHistory[scope].push(operation)
    }
  }

  private handleCommandClean = (event: CommandCleanEvent): void => {
    const { scope } = event

    delete this.undoHistory[scope]
    delete this.redoHistory[scope]
  }
}

Commander.systemName = 'Commander'
