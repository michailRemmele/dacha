import type { Config } from 'remiz'
import type { Resource } from 'i18next'

import type { WidgetSchema, WidgetPartSchema } from './widget-schema'

export interface Extension {
  components?: Record<string, unknown>
  systems?: Record<string, unknown>
  scripts?: Record<string, Record<string, unknown>>
  componentsSchema?: Record<string, WidgetSchema | undefined>
  systemsSchema?: Record<string, WidgetSchema | undefined>
  scriptsSchema?: Record<string, Record<string, WidgetPartSchema | undefined> | undefined>
  locales?: Resource
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
    RemizEditor: Record<string, unknown>
  }
}
