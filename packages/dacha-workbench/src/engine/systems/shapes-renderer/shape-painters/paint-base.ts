import type { BaseShape } from '../../../components/shape'

export const paintBase = (context: CanvasRenderingContext2D, shape: BaseShape): void => {
  const {
    strokeWidth,
    strokeColor,
    color,
  } = shape

  context.fillStyle = color
  context.strokeStyle = strokeColor
  context.lineWidth = strokeWidth
}
