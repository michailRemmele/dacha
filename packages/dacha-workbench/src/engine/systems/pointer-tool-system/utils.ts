import { MathOps } from 'remiz'
import type { GameObject, Transform, Renderable } from 'remiz'

import type { Shape, RectangleShape } from '../../components/shape'

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

const getAngle = (rotation: number): number => {
  const normalizedAngle = Math.abs(rotation) % 180
  const acuteAngle = Math.min(normalizedAngle, 180 - normalizedAngle)

  return MathOps.degToRad(acuteAngle)
}

export const updateFrameSize = (frame: GameObject, gameObject: GameObject): void => {
  const renderable = gameObject.getComponent('renderable') as Renderable | undefined
  const transform = gameObject.getComponent('transform') as Transform | undefined

  let offsetX = 0
  let offsetY = 0
  let rotation = 0
  let width = 0
  let height = 0
  if (
    renderable !== undefined
    && renderable.width !== 0
    && renderable.height !== 0
    && transform !== undefined
  ) {
    offsetX = transform.offsetX
    offsetY = transform.offsetY
    rotation = getAngle(transform.rotation)

    // Need to perform scale before rotation since main renderer has the same order
    width = renderable.width * transform.scaleX
    height = renderable.height * transform.scaleY
  }

  const frameTransform = frame.getComponent('transform') as Transform
  const frameShape = frame.getComponent('shape') as Shape
  const properties = frameShape.properties as RectangleShape

  frameTransform.offsetX = offsetX
  frameTransform.offsetY = offsetY
  properties.width = Math.cos(rotation) * width + Math.sin(rotation) * height
  properties.height = Math.sin(rotation) * width + Math.cos(rotation) * height
}
