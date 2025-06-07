import { WorldSystem } from 'dacha'
import type {
  World,
  Config,
  WorldSystemOptions,
  UpdateOptions,
} from 'dacha'
import * as Events from 'dacha/events'

import { EventType } from '../../../events'
import { CommanderStore } from '../../../store'
import type { EditorConfig, Extension } from '../../../types/global'

const DEFAULT_AUTO_SAVE_INTERVAL = 10_000

interface ProjectLoaderResources {
  store: CommanderStore
}

export class ProjectLoader extends WorldSystem {
  private world: World
  private editorCofig: EditorConfig

  private autoSaveInterval: number

  constructor(options: WorldSystemOptions) {
    super()

    this.world = options.world
    this.editorCofig = window.electron.getEditorConfig()

    this.world.data.configStore = (options.resources as ProjectLoaderResources).store
    this.world.data.editorConfig = this.editorCofig

    this.autoSaveInterval = this.editorCofig.autoSaveInterval ?? DEFAULT_AUTO_SAVE_INTERVAL

    window.electron.onSave(() => {
      this.saveProjectConfig()
    })
  }

  async onWorldLoad(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!window.electron.isExtensionAvailable()) {
        this.setUpData()

        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = '/extension.js'

      script.onload = (): void => {
        this.setUpData(window.editorExtension)

        resolve()
      }
      script.onerror = (): void => {
        reject(new Error('Error while loading extension script'))
      }

      document.body.appendChild(script)
    })
  }

  private setUpData(extension: Extension = {}): void {
    const {
      events = [],
      locales = {},
    } = extension

    this.world.data.extension = {
      events: [
        ...events,
        ...Object.values(Events),
      ],
      locales,
    }
  }

  private saveProjectConfig(): void {
    const projectConfig = (this.world.data.configStore as CommanderStore).get([]) as Config
    window.electron.saveProjectConfig(projectConfig)

    this.world.dispatchEvent(EventType.SaveProject)
  }

  update(options: UpdateOptions): void {
    if (!this.editorCofig.autoSave) {
      return
    }

    const { deltaTime } = options

    this.autoSaveInterval -= deltaTime
    if (this.autoSaveInterval <= 0) {
      this.saveProjectConfig()
      this.autoSaveInterval = this.editorCofig.autoSaveInterval ?? DEFAULT_AUTO_SAVE_INTERVAL
    }
  }
}

ProjectLoader.systemName = 'ProjectLoader'
