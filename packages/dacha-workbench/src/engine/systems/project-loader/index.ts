import type {
  System,
  SystemOptions,
  SceneContext,
} from 'remiz'

import type { EditorConfig } from '../../../types/global'

export class ProjectLoader implements System {
  private sceneContext: SceneContext
  private editorCofig: EditorConfig

  constructor(options: SystemOptions) {
    this.sceneContext = options.sceneContext
    this.editorCofig = window.electron.getEditorConfig()

    this.sceneContext.data.projectConfig = window.electron.getProjectConfig()
    this.sceneContext.data.editorConfig = this.editorCofig
  }

  async load(): Promise<void> {
    const { components, systems } = this.editorCofig

    if (components) {
      this.sceneContext.data.projectComponents = (await import('project-components')).default
    }

    if (systems) {
      this.sceneContext.data.projectSystems = (await import ('project-systems')).default
    }
  }

  update(): void {}
}
