import {
  Transform,
  Camera,
} from 'dacha'
import type { Actor } from 'dacha'

export class CoordinatesTransformer {
  private cameraScale: number
  private cameraOffsetX: number
  private cameraOffsetY: number

  private viewportWidth: number
  private viewportHeight: number

  private devicePixelRatio: number

  constructor() {
    this.cameraScale = 1
    this.cameraOffsetX = 0
    this.cameraOffsetY = 0

    this.viewportWidth = 0
    this.viewportHeight = 0

    this.devicePixelRatio = 1
  }

  setCamera(camera?: Actor): void {
    const offsetX = camera?.getComponent(Transform).offsetX ?? 0
    const offsetY = camera?.getComponent(Transform).offsetY ?? 0
    const zoom = camera?.getComponent(Camera).zoom ?? 1

    this.cameraScale = zoom
    this.cameraOffsetX = offsetX
    this.cameraOffsetY = offsetY
  }

  setViewport(width: number, height: number): void {
    this.viewportWidth = width * this.devicePixelRatio
    this.viewportHeight = height * this.devicePixelRatio
  }

  getViewportWidth(): number {
    return this.viewportWidth
  }

  getViewportHeight(): number {
    return this.viewportHeight
  }

  setDevicePixelRatio(value: number): void {
    this.devicePixelRatio = value
  }

  projectSize(value: number, scale = 1): number {
    const globalScale = this.cameraScale * this.devicePixelRatio
    return value * scale * globalScale
  }

  projectX(x: number, centerX = 0, scale = 1): number {
    const globalScale = this.cameraScale * this.devicePixelRatio
    return globalScale * (x - scale * centerX - this.cameraOffsetX) + this.viewportWidth / 2
  }

  projectY(y: number, centerY = 0, scale = 1): number {
    const globalScale = this.cameraScale * this.devicePixelRatio
    return globalScale * (y - scale * centerY - this.cameraOffsetY) + this.viewportHeight / 2
  }
}
