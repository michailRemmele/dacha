import type { Transform } from 'remiz'

import type { BaseShape, CircleShape } from '../../../components/shape'
import type { CoordinatesTransformer } from '../coordinates-transformer'

import { paintBase } from './paint-base'

export const paintCircle = (
  context: CanvasRenderingContext2D,
  transformer: CoordinatesTransformer,
  shape: BaseShape,
  transform: Transform,
): void => {
  const { offsetX, offsetY } = transform
  const { radius } = shape as CircleShape

  paintBase(context, shape)

  const projectedRadius = transformer.projectSize(radius)
  const projectedX = transformer.projectX(offsetX)
  const projectedY = transformer.projectY(offsetY)

  context.beginPath()
  context.arc(projectedX, projectedY, projectedRadius, 0, 2 * Math.PI)
  context.stroke()
}
