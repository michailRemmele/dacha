import type {
  Config,
  System,
  SystemOptions,
  SceneContext,
  UpdateOptions,
  MessageBus,
} from 'remiz'

import { SAVE_PROJECT_MSG } from '../../../consts/message-types'
import { Store } from '../../../store'
import type { Data } from '../../../store'
import type { EditorConfig, Extension } from '../../../types/global'

const DEFAULT_AUTO_SAVE_INTERVAL = 10_000

export class ProjectLoader implements System {
  private sceneContext: SceneContext
  private messageBus: MessageBus
  private editorCofig: EditorConfig

  private autoSaveInterval: number

  constructor(options: SystemOptions) {
    this.sceneContext = options.sceneContext
    this.messageBus = options.messageBus
    this.editorCofig = window.electron.getEditorConfig()

    const projectConfig = window.electron.getProjectConfig()
    this.sceneContext.data.configStore = new Store(projectConfig as unknown as Data)
    this.sceneContext.data.editorConfig = this.editorCofig

    this.autoSaveInterval = this.editorCofig.autoSaveInterval ?? DEFAULT_AUTO_SAVE_INTERVAL
  }

  private setUpData(extension: Extension = {}): void {
    const {
      componentsSchema = {},
      systemsSchema = {},
      scriptsSchema = {},
      locales = {},
    } = extension

    this.sceneContext.data.extension = {
      componentsSchema,
      systemsSchema,
      scriptsSchema,
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
    const projectConfig = (this.sceneContext.data.configStore as Store).get([]) as Config
    window.electron.saveProjectConfig(projectConfig)

    this.messageBus.send({ type: SAVE_PROJECT_MSG })
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
