import {
  MathOps,
  Transform,
  Sprite,
  Actor,
} from 'dacha'

import { Shape } from '../../components/shape'
import type { RectangleShape } from '../../components/shape'
import { getIdByPath } from '../../../utils/get-id-by-path'

import type { SelectionArea } from './types'
import { SCENE_PATH_LEGTH } from './consts'

const accumulatePath = (actor: Actor, path: Array<string>): void => {
  path.unshift(`id:${actor.id}`)

  if (actor.parent instanceof Actor) {
    path.unshift('children')
    accumulatePath(actor.parent, path)
  }
}

export const buildActorPath = (actor: Actor, sceneId: string): Array<string> => {
  const path: Array<string> = []

  accumulatePath(actor, path)
  path.unshift('scenes', `id:${sceneId}`, 'actors')

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

export const updateAreaSize = (selectionArea: SelectionArea): void => {
  const { sceneSize, area } = selectionArea

  const transform = area.getComponent(Transform)
  const shape = area.getComponent(Shape)
  const properties = shape.properties as RectangleShape

  transform.offsetX = (sceneSize.x0 + sceneSize.x1) / 2
  transform.offsetY = (sceneSize.y0 + sceneSize.y1) / 2
  properties.width = Math.abs(sceneSize.x0 - sceneSize.x1)
  properties.height = Math.abs(sceneSize.y0 - sceneSize.y1)
}

export const getActorIdByPath = (
  path: string[],
  currentSceneId: string | undefined,
): string | undefined => {
  if (!currentSceneId) {
    return undefined
  }

  if (path !== undefined && path[0] === 'scenes' && path.length > SCENE_PATH_LEGTH) {
    const sceneId = getIdByPath([path[1]])

    if (sceneId !== currentSceneId) {
      return undefined
    }

    return getIdByPath(path)
  }
  return undefined
}
