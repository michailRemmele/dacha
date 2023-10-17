import { System } from 'remiz'
import type {
  MessageBus,
  SystemOptions,
} from 'remiz'

import {
  COMMAND_MSG,
  COMMAND_UNDO_MSG,
  COMMAND_CLEAN_MSG,
  COMMAND_REDO_MSG,
} from '../../../consts/message-types'
import type {
  CommandMessage,
  CommandUndoMessage,
  CommandRedoMessage,
  CommandCleanMessage,
} from '../../../types/messages'
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
  private messageBus: MessageBus
  private configStore: Store
  private commands: Record<string, Command>
  private undoHistory: Record<string, Array<HistoryOperation>>
  private redoHistory: Record<string, Array<HistoryOperation>>

  constructor(options: SystemOptions) {
    super()

    const {
      messageBus,
      sceneContext,
    } = options

    this.messageBus = messageBus
    this.configStore = sceneContext.data.configStore as Store
    this.commands = Object.keys(commands).reduce((acc: Record<string, Command>, key) => {
      const SomeCommand = commands[key]
      acc[key] = new SomeCommand(this.configStore)

      return acc
    }, {})
    this.undoHistory = {}
    this.redoHistory = {}
  }

  private handleCommandMessages(): void {
    const messages = this.messageBus.get(COMMAND_MSG) as Array<CommandMessage>
    if (!messages?.length) {
      return
    }

    messages.forEach(({
      command,
      scope,
      isEffect,
      options,
    }) => {
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
    })
  }

  private handleUndoMessages(): void {
    const undoMessages = this.messageBus.get(COMMAND_UNDO_MSG) as Array<CommandUndoMessage>
    if (!undoMessages?.length) {
      return
    }

    undoMessages.forEach(({ scope }) => {
      if (this.undoHistory[scope]?.length > 0) {
        const operation = this.undoHistory[scope].pop() as HistoryOperation

        for (let j = operation.effects.length - 1; j >= 0; j -= 1) {
          operation.effects[j].undo()
        }

        operation.undo()

        this.redoHistory[scope].push(operation)
      }
    })
  }

  private handleRedoMessages(): void {
    const redoMessages = this.messageBus.get(COMMAND_REDO_MSG) as Array<CommandRedoMessage>
    if (!redoMessages?.length) {
      return
    }

    redoMessages.forEach(({ scope }) => {
      if (this.redoHistory[scope]?.length > 0) {
        const operation = this.redoHistory[scope].pop() as HistoryOperation

        operation.redo()
        operation.effects.forEach((effect) => effect.redo())

        this.undoHistory[scope].push(operation)
      }
    })
  }

  private handleCleanMessages(): void {
    const cleanMessages = this.messageBus.get(COMMAND_CLEAN_MSG) as Array<CommandCleanMessage>
    if (!cleanMessages?.length) {
      return
    }

    cleanMessages.forEach(({ scope }) => {
      delete this.undoHistory[scope]
      delete this.redoHistory[scope]
    })
  }

  update(): void {
    this.handleCommandMessages()
    this.handleUndoMessages()
    this.handleRedoMessages()
    this.handleCleanMessages()
  }
}

Commander.systemName = 'Commander'
