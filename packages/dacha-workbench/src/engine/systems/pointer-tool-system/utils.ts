import { MathOps } from 'remiz'
import type { GameObject } from 'remiz'

const accumulatePath = (gameObject: GameObject, path: Array<string>): void => {
  path.unshift(`id:${gameObject.id}`)

  if (gameObject.parent !== undefined) {
    path.unshift('children')
    accumulatePath(gameObject.parent, path)
  }
}

export const buildGameObjectPath = (gameObject: GameObject, levelId: string): Array<string> => {
  const path: Array<string> = []

  accumulatePath(gameObject, path)
  path.unshift('levels', `id:${levelId}`, 'gameObjects')

  return path
}

export const getAngle = (rotation: number): number => {
  const normalizedAngle = Math.abs(rotation) % 180
  const acuteAngle = Math.min(normalizedAngle, 180 - normalizedAngle)

  return MathOps.degToRad(acuteAngle)
}
