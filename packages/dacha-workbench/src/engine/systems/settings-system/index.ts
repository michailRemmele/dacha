import { System } from 'dacha'
import type {
  Scene,
  SystemOptions,
  Actor,
} from 'dacha'

import { EventType } from '../../../events'
import type { SetSettingsValueEvent } from '../../../events'
import { Settings } from '../../components'
import { persistentStorage } from '../../../persistent-storage'

export class SettingsSystem extends System {
  private scene: Scene

  private mainActor: Actor

  constructor(options: SystemOptions) {
    super()

    const { scene } = options

    this.scene = scene
    this.mainActor = scene.data.mainActor as Actor
  }

  mount(): void {
    this.scene.addEventListener(EventType.SetSettingsValue, this.handleSetSettingsValue)
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.SetSettingsValue, this.handleSetSettingsValue)
  }

  private handleSetSettingsValue = (event: SetSettingsValueEvent): void => {
    const { name, value } = event

    const settings = this.mainActor.getComponent(Settings)
    settings.data[name] = value

    persistentStorage.set(`canvas.mainActor.settings.${name}`, value)
  }
}

SettingsSystem.systemName = 'SettingsSystem'
