import {
  Animatable,
  Camera,
  Collider,
  KeyboardControl,
  MouseControl,
  Sprite,
  Shape,
  BitmapText,
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
import { mouseControl } from './mouse-control';
import { sprite } from './sprite';
import { shape } from './shape';
import { bitmapText } from './bitmap-text';
import { rigidBody } from './rigid-body';
import { behaviors } from './behaviors';
import { transform } from './transform';
import { audioSource } from './audio-source';

export const componentsSchema: Record<string, WidgetSchema> = {
  [Animatable.componentName]: animatable,
  [Camera.componentName]: camera,
  [Collider.componentName]: collider,
  [KeyboardControl.componentName]: keyboardControl,
  [MouseControl.componentName]: mouseControl,
  [Sprite.componentName]: sprite,
  [Shape.componentName]: shape,
  [BitmapText.componentName]: bitmapText,
  [RigidBody.componentName]: rigidBody,
  [Behaviors.componentName]: behaviors,
  [Transform.componentName]: transform,
  [AudioSource.componentName]: audioSource,
};
