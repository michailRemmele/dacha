import { Camera } from './camera';
import { KeyboardControl } from './keyboard-control';
import { ColliderContainer } from './collider-container';
import { RigidBody } from './rigid-body';
import { Animatable } from './animatable';
import { Renderable } from './renderable';
import { Transform } from './transform';
import { MouseControl } from './mouse-control';
import { ScriptComponent } from './script';
import { Light } from './light';

export const contribComponents = {
  camera: Camera,
  keyboardControl: KeyboardControl,
  colliderContainer: ColliderContainer,
  rigidBody: RigidBody,
  animatable: Animatable,
  renderable: Renderable,
  transform: Transform,
  mouseControl: MouseControl,
  script: ScriptComponent,
  light: Light,
};

export {
  Camera,
  KeyboardControl,
  ColliderContainer,
  RigidBody,
  Animatable,
  Renderable,
  Transform,
  MouseControl,
  ScriptComponent,
  Light,
};
