import type { WidgetSchema } from '../../../types/widget-schema'

import { animatable } from './animatable'
import { camera } from './camera'
import { colliderContainer } from './collider-container'
import { keyboardControl } from './keyboard-control'
import { light } from './light'
import { mouseControl } from './mouse-control'
import { renderable } from './renderable'
import { rigidBody } from './rigid-body'
import { script } from './script'
import { transform } from './transform'

export const componentsSchema: Record<string, WidgetSchema> = {
  animatable,
  camera,
  colliderContainer,
  keyboardControl,
  light,
  mouseControl,
  renderable,
  rigidBody,
  script,
  transform,
}
