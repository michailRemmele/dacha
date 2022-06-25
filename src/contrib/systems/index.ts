import { Animator } from './animator';
import { CameraSystem } from './camera-system';
import { CollisionBroadcastSystem } from './collision-broadcast-system';
import { CollisionDetectionSystem } from './collision-detection-system';
import { CollisionSolver } from './collision-solver';
import { ConstraintSolver } from './constraint-solver';
import { GameStatsMeter } from './game-stats-meter';
import { Jammer } from './jammer';
import { KeyboardInputSystem } from './keyboard-input-system';
import { KeyboardControlSystem } from './keyboard-control-system';
import { MouseControlSystem } from './mouse-control-system';
import { MouseInputSystem } from './mouse-input-system';
import { MouseInputCoordinatesProjector } from './mouse-input-coordinates-projector';
import { PhysicsSystem } from './physics-system';
import { ScriptSystem } from './script-system';
import { ThreeJSRenderer } from './three-js-renderer';
import { UiBridge } from './ui-bridge';

export const contribSystems = {
  animator: Animator,
  cameraSystem: CameraSystem,
  collisionBroadcastSystem: CollisionBroadcastSystem,
  collisionDetectionSystem: CollisionDetectionSystem,
  collisionSolver: CollisionSolver,
  constraintSolver: ConstraintSolver,
  gameStatsMeter: GameStatsMeter,
  jammer: Jammer,
  keyboardInputSystem: KeyboardInputSystem,
  keyboardControlSystem: KeyboardControlSystem,
  mouseControlSystem: MouseControlSystem,
  mouseInputSystem: MouseInputSystem,
  mouseInputCoordinatesProjector: MouseInputCoordinatesProjector,
  physicsSystem: PhysicsSystem,
  scriptSystem: ScriptSystem,
  threeJSRenderer: ThreeJSRenderer,
  uiBridge: UiBridge,
};
