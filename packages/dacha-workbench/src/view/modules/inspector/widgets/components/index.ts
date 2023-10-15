import {
  Animatable,
  Camera,
  ColliderContainer,
  KeyboardControl,
  Light,
  MouseControl,
  Renderable,
  RigidBody,
  Script,
  Transform,
} from 'remiz'

import type { WidgetSchema } from '../../../../../types/widget-schema'

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
  [Animatable.componentName]: animatable,
  [Camera.componentName]: camera,
  [ColliderContainer.componentName]: colliderContainer,
  [KeyboardControl.componentName]: keyboardControl,
  [Light.componentName]: light,
  [MouseControl.componentName]: mouseControl,
  [Renderable.componentName]: renderable,
  [RigidBody.componentName]: rigidBody,
  [Script.componentName]: script,
  [Transform.componentName]: transform,
}
