import type { WidgetSchema } from '../../../types/widget-schema'

import { camera } from './camera'
import { colliderContainer } from './collider-container'
import { light } from './light'
import { renderable } from './renderable'
import { rigidBody } from './rigid-body'
import { transform } from './transform'

export const componentsSchema: Record<string, WidgetSchema | undefined> = {
  camera,
  colliderContainer,
  light,
  renderable,
  rigidBody,
  transform,
}
