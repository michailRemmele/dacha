export interface ElectronAPI {
  getProjectInfo: () => string,
}

declare global {
  interface Window {
    electron: ElectronAPI
  }
}
