import { BaseShape } from './base-shape'
import type { BaseShapeConfig } from './base-shape'

interface RectangleShapeConfig extends BaseShapeConfig {
  width: number
  height: number
}

export class RectangleShape extends BaseShape {
  width: number
  height: number

  constructor(properties: BaseShape) {
    super(properties)

    const { width, height } = properties as RectangleShapeConfig

    this.width = width
    this.height = height
  }
}
