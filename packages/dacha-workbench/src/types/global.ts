import type { Config } from 'dacha'
import type { Resource } from 'i18next'
import type { GlobalToken } from 'antd'

import type { CustomToken } from '../view/themes/types'
import '../events'

export interface Extension {
  events?: string[]
  locales?: Resource
}

export interface EditorConfig {
  projectConfig: string
  assets: string
  systemsDir: string
  componentsDir: string
  behaviorsDir: string
  eventsEntry: string
  localesEntry: string
  libraries: string[]
  autoSave?: boolean
  autoSaveInterval?: number
  formatWidgetNames?: boolean
}

export interface ElectronAPI {
  getProjectConfig: () => Config,
  getEditorConfig: () => EditorConfig
  openAssetsDialog: (extensions?: Array<string>) => Promise<string | undefined>
  saveProjectConfig: (config: Config) => void
  setUnsavedChanges: (unsavedChanges: boolean) => void
  onSave: (callback: () => void) => void
  onSettings: (callback: (type: string) => void) => void
  onSwitchTheme: (callback: () => void) => () => void
  onUndo: (callback: () => void) => () => void
  onRedo: (callback: () => void) => () => void
  onCut: (callback: () => void) => () => void
  onCopy: (callback: () => void) => () => void
  onPaste: (callback: () => void) => () => void
  onDelete: (callback: () => void) => () => void
  loadPersistentStorage: () => Record<string, unknown>
  savePersistentStorage: (state: Record<string, unknown>) => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    widgets?: unknown
    events?: Record<string, unknown>
    locales?: { default?: Resource }
    DachaWorkbench: Record<string, unknown>
  }
}

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends GlobalToken, CustomToken {}
}
