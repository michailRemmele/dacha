import {
  Animatable,
  Camera,
  Collider,
  KeyboardControl,
  Light,
  MouseControl,
  Sprite,
  Shape,
  RigidBody,
  Behaviors,
  Transform,
  AudioSource,
} from 'dacha';

import type { WidgetSchema } from '../../../../../types/widget-schema';

import { animatable } from './animatable';
import { camera } from './camera';
import { collider } from './collider';
import { keyboardControl } from './keyboard-control';
import { light } from './light';
import { mouseControl } from './mouse-control';
import { sprite } from './sprite';
import { shape } from './shape';
import { rigidBody } from './rigid-body';
import { behaviors } from './behaviors';
import { transform } from './transform';
import { audioSource } from './audio-source';

export const componentsSchema: Record<string, WidgetSchema> = {
  [Animatable.componentName]: animatable,
  [Camera.componentName]: camera,
  [Collider.componentName]: collider,
  [KeyboardControl.componentName]: keyboardControl,
  [Light.componentName]: light,
  [MouseControl.componentName]: mouseControl,
  [Sprite.componentName]: sprite,
  [Shape.componentName]: shape,
  [RigidBody.componentName]: rigidBody,
  [Behaviors.componentName]: behaviors,
  [Transform.componentName]: transform,
  [AudioSource.componentName]: audioSource,
};
