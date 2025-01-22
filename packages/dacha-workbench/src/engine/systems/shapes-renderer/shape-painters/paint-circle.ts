import type { Transform } from 'dacha'

import type { BaseShape, CircleShape } from '../../../components/shape'
import type { CoordinatesTransformer } from '../coordinates-transformer'

import { paintBase } from './paint-base'

export const paintCircle = (
  context: CanvasRenderingContext2D,
  transformer: CoordinatesTransformer,
  shape: BaseShape,
  transform: Transform,
): void => {
  const {
    offsetX,
    offsetY,
    scaleX,
    scaleY,
  } = transform
  const { radius } = shape as CircleShape

  paintBase(context, shape)

  const projectedRadiusX = transformer.projectSize(radius, scaleX)
  const projectedRadiusY = transformer.projectSize(radius, scaleY)
  const projectedX = transformer.projectX(offsetX, 0, scaleX)
  const projectedY = transformer.projectY(offsetY, 0, scaleY)

  context.beginPath()
  context.ellipse(
    projectedX,
    projectedY,
    projectedRadiusX,
    projectedRadiusY,
    0,
    0,
    2 * Math.PI,
  )
  context.stroke()
}
