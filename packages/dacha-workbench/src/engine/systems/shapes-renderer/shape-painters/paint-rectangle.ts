import type { Transform } from 'remiz'

import type { BaseShape, RectangleShape } from '../../../components/shape'
import type { CoordinatesTransformer } from '../coordinates-transformer'

import { paintBase } from './paint-base'

export const paintRectangle = (
  context: CanvasRenderingContext2D,
  transformer: CoordinatesTransformer,
  shape: BaseShape,
  transform: Transform,
): void => {
  const { offsetX, offsetY } = transform
  const { width, height } = shape as RectangleShape

  paintBase(context, shape)

  const projectedWidth = transformer.projectSize(width)
  const projectedHeight = transformer.projectSize(height)
  const projectedX = transformer.projectX(offsetX - width / 2)
  const projectedY = transformer.projectY(offsetY - height / 2)

  context.strokeRect(projectedX, projectedY, projectedWidth, projectedHeight)
  context.fillRect(projectedX, projectedY, projectedWidth, projectedHeight)
}
