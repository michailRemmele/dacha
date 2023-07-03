import { Animator } from './animator';
import { CameraSystem } from './camera-system';
import { GameStatsMeter } from './game-stats-meter';
import { KeyboardInputSystem } from './keyboard-input-system';
import { KeyboardControlSystem } from './keyboard-control-system';
import { MouseControlSystem } from './mouse-control-system';
import { MouseInputSystem } from './mouse-input-system';
import { MouseInputCoordinatesProjector } from './mouse-input-coordinates-projector';
import { PhysicsSystem } from './physics-system';
import { ScriptSystem } from './script-system';
import { Renderer } from './three-js-renderer';
import { UiBridge } from './ui-bridge';

export const contribSystems = {
  animator: Animator,
  cameraSystem: CameraSystem,
  gameStatsMeter: GameStatsMeter,
  keyboardInputSystem: KeyboardInputSystem,
  keyboardControlSystem: KeyboardControlSystem,
  mouseControlSystem: MouseControlSystem,
  mouseInputSystem: MouseInputSystem,
  mouseInputCoordinatesProjector: MouseInputCoordinatesProjector,
  physicsSystem: PhysicsSystem,
  scriptSystem: ScriptSystem,
  renderer: Renderer,
  uiBridge: UiBridge,
};
