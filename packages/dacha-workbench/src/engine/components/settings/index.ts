import { Component } from 'dacha'

export interface SettingsConfig {
  showGrid: boolean
  gridStep: number
  gridColor: string
}

export class Settings extends Component {
  data: Record<keyof SettingsConfig, unknown>

  constructor(config: SettingsConfig) {
    super()

    this.data = {
      showGrid: config.showGrid,
      gridStep: config.gridStep,
      gridColor: config.gridColor,
    }
  }

  clone(): Settings {
    return new Settings({
      showGrid: this.data.showGrid,
      gridStep: this.data.gridStep,
      gridColor: this.data.gridColor,
    } as SettingsConfig)
  }
}

Settings.componentName = 'Settings'
