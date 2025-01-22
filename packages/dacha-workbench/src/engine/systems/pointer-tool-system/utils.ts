import {
  MathOps,
  Transform,
  Sprite,
  Actor,
} from 'dacha'

import { Shape } from '../../components/shape'
import type { RectangleShape } from '../../components/shape'

const accumulatePath = (actor: Actor, path: Array<string>): void => {
  path.unshift(`id:${actor.id}`)

  if (actor.parent instanceof Actor) {
    path.unshift('children')
    accumulatePath(actor.parent, path)
  }
}

export const buildActorPath = (actor: Actor, levelId: string): Array<string> => {
  const path: Array<string> = []

  accumulatePath(actor, path)
  path.unshift('levels', `id:${levelId}`, 'actors')

  return path
}

const getAngle = (rotation: number): number => {
  const normalizedAngle = Math.abs(rotation) % 180
  const acuteAngle = Math.min(normalizedAngle, 180 - normalizedAngle)

  return MathOps.degToRad(acuteAngle)
}

export const updateFrameSize = (frame: Actor, actor: Actor): void => {
  const sprite = actor.getComponent(Sprite)
  const transform = actor.getComponent(Transform)

  let offsetX = 0
  let offsetY = 0
  let rotation = 0
  let width = 0
  let height = 0
  if (
    sprite !== undefined
    && sprite.width !== 0
    && sprite.height !== 0
    && transform !== undefined
  ) {
    offsetX = transform.offsetX
    offsetY = transform.offsetY
    rotation = getAngle(transform.rotation)

    // Need to perform scale before rotation since main renderer has the same order
    width = sprite.width * transform.scaleX
    height = sprite.height * transform.scaleY
  }

  const frameTransform = frame.getComponent(Transform)
  const frameShape = frame.getComponent(Shape)
  const properties = frameShape.properties as RectangleShape

  frameTransform.offsetX = offsetX
  frameTransform.offsetY = offsetY
  properties.width = Math.cos(rotation) * width + Math.sin(rotation) * height
  properties.height = Math.sin(rotation) * width + Math.cos(rotation) * height
}
