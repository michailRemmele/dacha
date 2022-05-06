import { Config } from 'remiz'

export interface ElectronAPI {
  getGameConfig: () => Config,
}

declare global {
  interface Window {
    electron: ElectronAPI
  }
}
