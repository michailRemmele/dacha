import { Component } from 'dacha'

export type SettingsConfig = {
  showGrid: boolean
  gridStep: number
  gridColor: string
}

export class Settings extends Component {
  data: Record<keyof SettingsConfig, unknown>

  constructor(config: Record<string, unknown>) {
    super()

    const settingsConfig = config as SettingsConfig

    this.data = {
      showGrid: settingsConfig.showGrid,
      gridStep: settingsConfig.gridStep,
      gridColor: settingsConfig.gridColor,
    }
  }

  clone(): Settings {
    return new Settings({
      showGrid: this.data.showGrid,
      gridStep: this.data.gridStep,
      gridColor: this.data.gridColor,
    })
  }
}

Settings.componentName = 'Settings'
