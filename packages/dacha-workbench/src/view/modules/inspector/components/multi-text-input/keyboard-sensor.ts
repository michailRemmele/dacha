import { KeyboardCode } from '@dnd-kit/core'
import type { KeyboardCoordinateGetter } from '@dnd-kit/core'

export const keyboardCoordinatesGetter: KeyboardCoordinateGetter = (event, args) => {
  const { currentCoordinates } = args
  const delta = 14

  switch (event.code) {
    case KeyboardCode.Right:
      return {
        ...currentCoordinates,
        x: currentCoordinates.x + delta,
      }
    case KeyboardCode.Left:
      return {
        ...currentCoordinates,
        x: currentCoordinates.x - delta,
      }
    case KeyboardCode.Down:
      return {
        ...currentCoordinates,
        y: currentCoordinates.y + delta,
      }
    case KeyboardCode.Up:
      return {
        ...currentCoordinates,
        y: currentCoordinates.y - delta,
      }
    default:
      return undefined
  }
}
