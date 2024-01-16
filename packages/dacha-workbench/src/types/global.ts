import type { Config } from 'remiz'
import type { Resource } from 'i18next'
import type { GlobalToken } from 'antd'

import type { CustomToken } from '../view/themes/types'
import '../events'

import type { WidgetSchema, WidgetPartSchema } from './widget-schema'

export interface Extension {
  componentsSchema?: Record<string, WidgetSchema | undefined>
  systemsSchema?: Record<string, WidgetSchema | undefined>
  resourcesSchema?: Record<string, Record<string, WidgetPartSchema | undefined> | undefined>
  locales?: Resource
}

export interface EditorConfig {
  projectConfig: string
  assets: string
  extension?: string
  autoSave?: boolean
  autoSaveInterval?: number
}

export interface ElectronAPI {
  getProjectConfig: () => Config,
  getEditorConfig: () => EditorConfig
  isExtensionAvailable: () => boolean
  openAssetsDialog: (extensions?: Array<string>) => Promise<string | undefined>
  saveProjectConfig: (config: Config) => void
  setUnsavedChanges: (unsavedChanges: boolean) => void
  onSave: (callback: () => void) => void
  onSettings: (callback: (type: string) => void) => void
  onNeedsReload: (callback: () => void) => () => void
  onSwitchTheme: (callback: () => void) => () => void
  onUndo: (callback: () => void) => () => void
  onRedo: (callback: () => void) => () => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    editorExtension?: Extension
    RemizEditor: Record<string, unknown>
  }
}

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends GlobalToken, CustomToken {}
}
