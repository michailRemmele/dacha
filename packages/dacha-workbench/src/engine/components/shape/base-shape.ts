export interface BaseShapeConfig {
  strokeWidth: number
  strokeColor: string
  color: string
}

export class BaseShape {
  strokeWidth: number
  strokeColor: string
  color: string

  constructor(properties: BaseShapeConfig) {
    this.strokeWidth = properties.strokeWidth
    this.strokeColor = properties.strokeColor
    this.color = properties.color
  }
}
