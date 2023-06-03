import type {
  Transform,
  Renderable,
} from 'remiz'

const TOLERANCE = 0.01

export const isFloatEqual = (a: number, b: number): boolean => Math.abs(a - b) < TOLERANCE

export const getSizeX = (transform: Transform, renderable?: Renderable): number => {
  const scaleX = transform.scaleX || 1
  const width = renderable?.width || 0

  return scaleX * width
}
export const getSizeY = (transform: Transform, renderable?: Renderable): number => {
  const scaleY = transform.scaleY || 1
  const height = renderable?.height || 0

  return scaleY * height
}
