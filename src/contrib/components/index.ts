import Camera from './camera/camera';
import KeyboardControl from './keyboardControl/keyboardControl';
import ColliderContainer from './colliderContainer/colliderContainer';
import RigidBody from './rigidBody/rigidBody';
import Animatable from './animatable/animatable';
import Renderable from './renderable/renderable';
import { Transform } from './transform';
import MouseControl from './mouseControl/mouseControl';
import Script from './script/script';

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
};
