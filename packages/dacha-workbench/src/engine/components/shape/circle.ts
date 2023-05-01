import { BaseShape } from './base-shape'
import type { BaseShapeConfig } from './base-shape'

interface CircleShapeConfig extends BaseShapeConfig {
  radius: number
}

export class CircleShape extends BaseShape {
  radius: number

  constructor(properties: BaseShapeConfig) {
    super(properties)

    const { radius } = properties as CircleShapeConfig

    this.radius = radius
  }
}
