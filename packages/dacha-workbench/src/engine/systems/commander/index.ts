import type {
  MessageBus,
  System,
  SystemOptions,
  Message,
} from 'remiz'

import { COMMAND_MSG } from '../../../consts/message-types'
import type { Store } from '../../../store'

import { commands } from './commands'
import { Command } from './commands/command'

export interface CommandMessage extends Message {
  command: string
  options: unknown
}

export class Commander implements System {
  private messageBus: MessageBus
  private configStore: Store
  private commands: Record<string, Command>

  constructor(options: SystemOptions) {
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
  }

  update(): void {
    const messages = (this.messageBus.get(COMMAND_MSG) || []) as Array<CommandMessage>

    messages.forEach((message) => {
      const cmd = this.commands[message.command]

      if (!cmd) {
        return
      }

      cmd.execute(message.options)
    })
  }
}
