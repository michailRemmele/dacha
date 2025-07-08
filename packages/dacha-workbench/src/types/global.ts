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
  contextRoot: string
  systems: string[]
  components: string[]
  behaviors: string[]
  widgets: string[]
  events: string
  locales: string
  libraries: string[]
  templates: {
    system: (name: string) => string
    component: (name: string) => string
    behavior: (name: string) => string
  }
  autoSave?: boolean
  autoSaveInterval?: number
  formatWidgetNames?: boolean
}

export interface ElectronAPI {
  getProjectConfig: () => Config,
  getEditorConfig: () => EditorConfig
  openAssetsDialog: (extensions?: string[]) => Promise<string | undefined>
  openPathSelectionDialog: () => Promise<string | undefined>
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
  onExtensionBuildStart: (callback: () => void) => () => void
  onExtensionBuildEnd: (callback: () => void) => () => void
  onNeedsUpdate: (callback: () => void) => () => void
  loadPersistentStorage: () => Record<string, unknown>
  savePersistentStorage: (state: Record<string, unknown>) => void
  createSystem: (name: string, filepath: string) => void
  createComponent: (name: string, filepath: string) => void
  createBehavior: (name: string, filepath: string) => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    widgets?: unknown
    events?: Record<string, unknown>
    locales?: { default?: Resource }
    extension?: {
      default: {
        events: string[]
        locales: Resource
      }
    }
    DachaWorkbench: Record<string, unknown>
  }
}

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends GlobalToken, CustomToken {}
}
