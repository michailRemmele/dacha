import type { Config } from 'remiz'

export interface Extension {
  components?: Record<string, unknown>
  systems?: Record<string, unknown>
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
