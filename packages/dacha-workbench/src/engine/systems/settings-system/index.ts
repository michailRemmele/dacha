import {
  System,
  SystemOptions,
  MessageBus,
  GameObject,
} from 'remiz'

import { SET_SETTINGS_VALUE_MSG } from '../../../consts/message-types'
import type { SetSettingsValueMessage } from '../../../types/messages'
import type { Settings } from '../../components'

const SETTINGS_COMPONENT_NAME = 'settings'

export class SettingsSystem implements System {
  private messageBus: MessageBus

  private mainObject: GameObject

  constructor(options: SystemOptions) {
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

    const settings = this.mainObject.getComponent(SETTINGS_COMPONENT_NAME) as Settings

    messages.forEach(({ name, value }) => {
      settings.data[name] = value
    })
  }
}
