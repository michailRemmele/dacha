import { Transform, Actor } from 'dacha'
import { type Bounds } from 'dacha/renderer'

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

export const updateFrameSize = (frame: Actor, bounds: Bounds): void => {
  const frameTransform = frame.getComponent(Transform)
  const frameShape = frame.getComponent(Shape)
  const properties = frameShape.properties as RectangleShape

  frameTransform.offsetX = (bounds.maxX + bounds.minX) / 2
  frameTransform.offsetY = (bounds.maxY + bounds.minY) / 2
  properties.width = bounds.width
  properties.height = bounds.height
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
