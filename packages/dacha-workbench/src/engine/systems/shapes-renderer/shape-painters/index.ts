import type { Transform } from 'dacha'

import type { ShapeType, BaseShape } from '../../../components/shape'
import type { CoordinatesTransformer } from '../coordinates-transformer'

import { paintRectangle } from './paint-rectangle'
import { paintCircle } from './paint-circle'

type PainterFn = (
  context: CanvasRenderingContext2D,
  transformer: CoordinatesTransformer,
  shape: BaseShape,
  transform: Transform,
) => void

export const painters: Record<ShapeType, PainterFn> = {
  rectangle: paintRectangle,
  circle: paintCircle,
}
