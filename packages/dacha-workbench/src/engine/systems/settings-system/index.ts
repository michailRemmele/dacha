import { SceneSystem } from 'dacha'
import type {
  World,
  SceneSystemOptions,
  Actor,
} from 'dacha'

import { EventType } from '../../../events'
import type { SetSettingsValueEvent } from '../../../events'
import { Settings } from '../../components'
import { persistentStorage } from '../../../persistent-storage'

export class SettingsSystem extends SceneSystem {
  private world: World

  private mainActor: Actor

  constructor(options: SceneSystemOptions) {
    super()

    const { world } = options

    this.world = world
    this.mainActor = world.data.mainActor as Actor

    this.world.addEventListener(EventType.SetSettingsValue, this.handleSetSettingsValue)
  }

  onSceneDestroy(): void {
    this.world.removeEventListener(EventType.SetSettingsValue, this.handleSetSettingsValue)
  }

  private handleSetSettingsValue = (event: SetSettingsValueEvent): void => {
    const { name, value } = event

    const settings = this.mainActor.getComponent(Settings)
    settings.data[name] = value

    persistentStorage.set(`canvas.mainActor.settings.${name}`, value)
  }
}

SettingsSystem.systemName = 'SettingsSystem'
