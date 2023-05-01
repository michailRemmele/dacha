import { Component } from 'remiz'

import { RectangleShape } from './rectangle'
import { CircleShape } from './circle'
import type { BaseShapeConfig } from './base-shape'

const shapes = {
  rectangle: RectangleShape,
  circle: CircleShape,
}

type ShapeType = keyof typeof shapes

interface ShapeConfig extends Record<string, unknown> {
  type: ShapeType
  properties: BaseShapeConfig
}

export class Shape extends Component {
  type: ShapeType
  properties: BaseShapeConfig

  constructor(componentName: string, config: Record<string, unknown>) {
    super(componentName)

    const shapeConfig = config as ShapeConfig

    this.type = shapeConfig.type
    this.properties = new shapes[shapeConfig.type](shapeConfig.properties)
  }

  clone(): Shape {
    return new Shape(this.componentName, {
      type: this.type,
      properties: this.properties,
    })
  }
}

export type { RectangleShape }
export type { CircleShape }
