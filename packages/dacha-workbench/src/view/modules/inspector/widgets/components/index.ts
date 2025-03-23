import {
  Animatable,
  Camera,
  ColliderContainer,
  KeyboardControl,
  Light,
  MouseControl,
  Sprite,
  RigidBody,
  ScriptBundle,
  Transform,
  AudioSource,
} from 'dacha'

import type { WidgetSchema } from '../../../../../types/widget-schema'

import { animatable } from './animatable'
import { camera } from './camera'
import { colliderContainer } from './collider-container'
import { keyboardControl } from './keyboard-control'
import { light } from './light'
import { mouseControl } from './mouse-control'
import { sprite } from './sprite'
import { rigidBody } from './rigid-body'
import { scriptBundle } from './script-bundle'
import { transform } from './transform'
import { audioSource } from './audio-source'

export const componentsSchema: Record<string, WidgetSchema> = {
  [Animatable.componentName]: animatable,
  [Camera.componentName]: camera,
  [ColliderContainer.componentName]: colliderContainer,
  [KeyboardControl.componentName]: keyboardControl,
  [Light.componentName]: light,
  [MouseControl.componentName]: mouseControl,
  [Sprite.componentName]: sprite,
  [RigidBody.componentName]: rigidBody,
  [ScriptBundle.componentName]: scriptBundle,
  [Transform.componentName]: transform,
  [AudioSource.componentName]: audioSource,
}
