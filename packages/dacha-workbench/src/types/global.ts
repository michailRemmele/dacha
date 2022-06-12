import type { Config } from 'remiz'

export interface EditorConfig {
  projectConfig: string
  assets: string
  components?: string
  systems?: string
}

export interface ElectronAPI {
  getProjectConfig: () => Config,
  getEditorConfig: () => EditorConfig
}

declare global {
  interface Window {
    electron: ElectronAPI
  }
}
