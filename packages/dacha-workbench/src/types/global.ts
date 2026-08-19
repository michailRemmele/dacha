import type { Config } from 'dacha';
import type { Resource } from 'i18next';

import type { ThemePreference } from '../view/providers/theme-provider/types';
import '../events';

export interface Extension {
  events?: string[];
  locales?: Resource;
}

export interface EditorConfig {
  projectConfig: string;
  assetsRoot: string;
  contextRoot: string;
  systems: string[];
  components: string[];
  behaviors: string[];
  assets: string[];
  widgets: string[];
  events: string;
  locales: string;
  libraries: string[];
  templates: {
    system: (name: string) => string;
    component: (name: string) => string;
    behavior: (name: string) => string;
    filterEffect?: (name: string) => string;
    shader?: (name: string) => string;
  };
  autoSave?: boolean;
  /** How often the project auto-saves, in seconds. */
  autoSaveInterval?: number;
  formatWidgetNames?: boolean;
}

export interface ElectronAPI {
  getProjectConfig: () => Config;
  getEditorConfig: () => EditorConfig;
  openAssetsDialog: (extensions?: string[]) => Promise<string | undefined>;
  openPathSelectionDialog: () => Promise<string | undefined>;
  saveProjectConfig: (config: Config) => void;
  setUnsavedChanges: (unsavedChanges: boolean) => void;
  updateMenuState: (field: string, value: unknown) => void;
  onSave: (callback: () => void) => void;
  onSettings: (callback: (type: string) => void) => void;
  onSwitchTheme: (callback: (theme: ThemePreference) => void) => () => void;
  onUndo: (callback: () => void) => () => void;
  onRedo: (callback: () => void) => () => void;
  onCut: (callback: () => void) => () => void;
  onCopy: (callback: () => void) => () => void;
  onPaste: (callback: (value?: string) => void) => () => void;
  onDelete: (callback: () => void) => () => void;
  onToggleDebugLayer: (
    callback: (id: string, enabled: boolean) => void,
  ) => () => void;
  onExtensionBuildStart: (callback: () => void) => () => void;
  onExtensionBuildEnd: (callback: () => void) => () => void;
  onNeedsUpdate: (callback: () => void) => () => void;
  loadPersistentStorage: () => Record<string, unknown>;
  savePersistentStorage: (state: Record<string, unknown>) => void;
  createSystem: (name: string, filepath: string) => void;
  createComponent: (name: string, filepath: string) => void;
  createBehavior: (name: string, filepath: string, type?: string) => void;
}

declare global {
  interface Window {
    electron: ElectronAPI;
    React: typeof import('react');
    ReactDOM: typeof import('react-dom');
    antd: typeof import('antd');
    ReactI18next: typeof import('react-i18next');
    dayjs: typeof import('dayjs');
    i18next: typeof import('i18next').default;
    extension?: {
      default: {
        events: string[];
        locales: Resource;
      };
    };
    DachaWorkbench: Record<string, unknown>;
  }
}
