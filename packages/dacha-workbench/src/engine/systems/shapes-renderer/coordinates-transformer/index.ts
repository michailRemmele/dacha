import {
  Transform,
  Camera,
} from 'remiz'
import type { Actor } from 'remiz'

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

  setCamera(camera: Actor): void {
    const {
      offsetX,
      offsetY,
    } = camera.getComponent(Transform)
    const { zoom } = camera.getComponent(Camera)

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
