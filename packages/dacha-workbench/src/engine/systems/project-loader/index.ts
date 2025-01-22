import { System } from 'dacha'
import type {
  Scene,
  Config,
  SystemOptions,
  UpdateOptions,
} from 'dacha'

import { EventType } from '../../../events'
import { CommanderStore } from '../../../store'
import type { EditorConfig, Extension } from '../../../types/global'

const DEFAULT_AUTO_SAVE_INTERVAL = 10_000

interface ProjectLoaderResources {
  store: CommanderStore
}

export class ProjectLoader extends System {
  private scene: Scene
  private editorCofig: EditorConfig

  private autoSaveInterval: number

  constructor(options: SystemOptions) {
    super()

    this.scene = options.scene
    this.editorCofig = window.electron.getEditorConfig()

    this.scene.data.configStore = (options.resources as ProjectLoaderResources).store
    this.scene.data.editorConfig = this.editorCofig

    this.autoSaveInterval = this.editorCofig.autoSaveInterval ?? DEFAULT_AUTO_SAVE_INTERVAL
  }

  private setUpData(extension: Extension = {}): void {
    const {
      componentsSchema = {},
      systemsSchema = {},
      resourcesSchema = {},
      globalReferences = {},
      locales = {},
    } = extension

    this.scene.data.extension = {
      componentsSchema,
      systemsSchema,
      resourcesSchema,
      globalReferences,
      locales,
    }
  }

  load(): Promise<void> {
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

  private saveProjectConfig(): void {
    const projectConfig = (this.scene.data.configStore as CommanderStore).get([]) as Config
    window.electron.saveProjectConfig(projectConfig)

    this.scene.dispatchEvent(EventType.SaveProject)
  }

  mount(): void {
    window.electron.onSave(() => {
      this.saveProjectConfig()
    })
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
