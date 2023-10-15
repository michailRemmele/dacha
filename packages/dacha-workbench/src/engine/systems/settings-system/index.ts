import { System } from 'remiz'
import type {
  SystemOptions,
  MessageBus,
  GameObject,
} from 'remiz'

import { Settings } from '../../components'
import { SET_SETTINGS_VALUE_MSG } from '../../../consts/message-types'
import type { SetSettingsValueMessage } from '../../../types/messages'

export class SettingsSystem extends System {
  private messageBus: MessageBus

  private mainObject: GameObject

  constructor(options: SystemOptions) {
    super()

    const {
      messageBus,
      sceneContext,
    } = options

    this.messageBus = messageBus
    this.mainObject = sceneContext.data.mainObject as GameObject
  }

  update(): void {
    const messages = this.messageBus.get(
      SET_SETTINGS_VALUE_MSG,
    ) as Array<SetSettingsValueMessage> | undefined

    if (!messages) {
      return
    }

    const settings = this.mainObject.getComponent(Settings)

    messages.forEach(({ name, value }) => {
      settings.data[name] = value
    })
  }
}

SettingsSystem.systemName = 'SettingsSystem'
