import type { Transform } from 'dacha'

import type { BaseShape, RectangleShape } from '../../../components/shape'
import type { CoordinatesTransformer } from '../coordinates-transformer'

import { paintBase } from './paint-base'

export const paintRectangle = (
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
  const { width, height } = shape as RectangleShape

  paintBase(context, shape)

  const projectedWidth = transformer.projectSize(scaleX * width)
  const projectedHeight = transformer.projectSize(scaleY * height)
  const projectedX = transformer.projectX(offsetX, width / 2, scaleX)
  const projectedY = transformer.projectY(offsetY, height / 2, scaleY)

  context.strokeRect(projectedX, projectedY, projectedWidth, projectedHeight)
  context.fillRect(projectedX, projectedY, projectedWidth, projectedHeight)
}
