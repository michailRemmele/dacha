import { System } from 'remiz'
import type {
  Scene,
  SystemOptions,
  GameObject,
} from 'remiz'

import { EventType } from '../../../events'
import type { SetSettingsValueEvent } from '../../../events'
import { Settings } from '../../components'

export class SettingsSystem extends System {
  private scene: Scene

  private mainObject: GameObject

  constructor(options: SystemOptions) {
    super()

    const { scene } = options

    this.scene = scene
    this.mainObject = scene.context.data.mainObject as GameObject
  }

  mount(): void {
    this.scene.addEventListener(EventType.SetSettingsValue, this.handleSetSettingsValue)
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.SetSettingsValue, this.handleSetSettingsValue)
  }

  private handleSetSettingsValue = (event: SetSettingsValueEvent): void => {
    const { name, value } = event

    const settings = this.mainObject.getComponent(Settings)
    settings.data[name] = value
  }
}

SettingsSystem.systemName = 'SettingsSystem'
