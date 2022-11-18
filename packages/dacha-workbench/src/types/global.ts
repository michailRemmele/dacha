import type { Config } from 'remiz'

import type { WidgetSchema } from './widget-schema'

export interface Extension {
  components?: Record<string, unknown>
  systems?: Record<string, unknown>
  componentsSchema?: Record<string, WidgetSchema | undefined>
  systemsSchema?: Record<string, WidgetSchema | undefined>
}

export interface EditorConfig {
  projectConfig: string
  assets: string
  extension?: string
}

export interface ElectronAPI {
  getProjectConfig: () => Config,
  getEditorConfig: () => EditorConfig
  getExtension: () => string | undefined
}

declare global {
  interface Window {
    electron: ElectronAPI
    editorExtension?: Extension
  }
}
