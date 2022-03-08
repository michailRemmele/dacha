import { Camera } from './camera';
import { KeyboardControl } from './keyboard-control';
import { ColliderContainer } from './collider-container';
import { RigidBody } from './rigid-body';
import { Animatable } from './animatable';
import { Renderable } from './renderable';
import { Transform } from './transform';
import { MouseControl } from './mouse-control';
import { Script } from './script';
import { Light } from './light';

export default {
  camera: Camera,
  keyboardControl: KeyboardControl,
  colliderContainer: ColliderContainer,
  rigidBody: RigidBody,
  animatable: Animatable,
  renderable: Renderable,
  transform: Transform,
  mouseControl: MouseControl,
  script: Script,
  light: Light,
};
