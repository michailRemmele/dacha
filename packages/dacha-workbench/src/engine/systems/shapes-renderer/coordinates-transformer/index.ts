import type {
  Transform,
  Camera,
  GameObject,
} from 'remiz'

import {
  TRANSFORM_COMPONENT_NAME,
  CAMERA_COMPONENT_NAME,
} from '../conts'

export class CoordinatesTransformer {
  private cameraScale: number
  private cameraOffsetX: number
  private cameraOffsetY: number

  private viewportWidth: number
  private viewportHeight: number

  constructor() {
    this.cameraScale = 1
    this.cameraOffsetX = 0
    this.cameraOffsetY = 0

    this.viewportWidth = 0
    this.viewportHeight = 0
  }

  setCamera(camera: GameObject): void {
    const {
      offsetX,
      offsetY,
    } = camera.getComponent(TRANSFORM_COMPONENT_NAME) as Transform
    const { zoom } = camera.getComponent(CAMERA_COMPONENT_NAME) as Camera

    this.cameraScale = zoom
    this.cameraOffsetX = offsetX
    this.cameraOffsetY = offsetY
  }

  setViewport(width: number, height: number): void {
    this.viewportWidth = width
    this.viewportHeight = height
  }

  projectSize(value: number, scale = 1): number {
    return value * this.cameraScale * scale
  }

  projectX(x: number, centerX = 0, scale = 1): number {
    return this.cameraScale * (x - scale * centerX - this.cameraOffsetX) + this.viewportWidth / 2
  }

  projectY(y: number, centerY = 0, scale = 1): number {
    return this.cameraScale * (y - scale * centerY - this.cameraOffsetY) + this.viewportHeight / 2
  }
}
