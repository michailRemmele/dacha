import type {
  System,
  SystemOptions,
  SceneContext,
} from 'remiz'

import type { EditorConfig, Extension } from '../../../types/global'

export class ProjectLoader implements System {
  private sceneContext: SceneContext
  private editorCofig: EditorConfig

  constructor(options: SystemOptions) {
    this.sceneContext = options.sceneContext
    this.editorCofig = window.electron.getEditorConfig()

    this.sceneContext.data.projectConfig = window.electron.getProjectConfig()
    this.sceneContext.data.editorConfig = this.editorCofig
  }

  private setUpData(extension?: Extension): void {
    this.sceneContext.data.projectComponents = extension?.components || {}
    this.sceneContext.data.projectSystems = extension?.systems || {}
    this.sceneContext.data.extComponentsSchema = extension?.componentsSchema || {}
    this.sceneContext.data.extSystemsSchema = extension?.systemsSchema || {}
  }

  load(): Promise<void> {
    return new Promise((resolve, reject) => {
      const extension = window.electron.getExtension()

      if (!extension) {
        this.setUpData()

        resolve()
        return
      }

      const blob = new Blob([extension], {
        type: 'application/javascript',
      })
      const url = URL.createObjectURL(blob)

      const script = document.createElement('script')
      script.src = url

      script.onload = (): void => {
        this.setUpData(window.editorExtension)

        resolve()
      }
      script.onerror = (): void => {
        reject(new Error(`Error while loading extension script: ${url}`))
      }

      document.body.appendChild(script)
    })
  }

  update(): void {}
}
