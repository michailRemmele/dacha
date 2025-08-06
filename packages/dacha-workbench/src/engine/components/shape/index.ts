import { Component } from 'dacha'

import { RectangleShape } from './rectangle'
import { CircleShape } from './circle'
import { BaseShape } from './base-shape'
import type { BaseShapeConfig } from './base-shape'

const shapes = {
  rectangle: RectangleShape,
  circle: CircleShape,
}

export type ShapeType = keyof typeof shapes

interface ShapeConfig {
  type: ShapeType
  properties: BaseShapeConfig
}

export class Shape extends Component {
  type: ShapeType
  properties: BaseShapeConfig

  constructor(config: ShapeConfig) {
    super()

    this.type = config.type
    this.properties = new shapes[config.type](config.properties)
  }

  clone(): Shape {
    return new Shape({
      type: this.type,
      properties: this.properties,
    })
  }
}

Shape.componentName = 'Shape'

export type {
  BaseShape,
  RectangleShape,
  CircleShape,
}
