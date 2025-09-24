import {
  Animator,
  CameraSystem,
  GameStatsMeter,
  KeyboardControlSystem,
  KeyboardInputSystem,
  MouseControlSystem,
  MouseInputSystem,
  PhysicsSystem,
  BehaviorSystem,
  Renderer,
  UIBridge,
  AudioSystem,
} from 'dacha';

import type { WidgetSchema } from '../../../../../types/widget-schema';

import { animator } from './animator';
import { cameraSystem } from './camera-system';
import { gameStatsMeter } from './game-stats-meter';
import { keyboardControlSystem } from './keyboard-control-system';
import { keyboardInputSystem } from './keyboard-input-system';
import { mouseControlSystem } from './mouse-control-system';
import { mouseInputSystem } from './mouse-input-system';
import { physicsSystem } from './physics-system';
import { behaviorSystem } from './behavior-system';
import { renderer } from './renderer';
import { uiBridge } from './ui-bridge';
import { audioSystem } from './audio-system';

export const systemsSchema: Record<string, WidgetSchema> = {
  [Animator.systemName]: animator,
  [CameraSystem.systemName]: cameraSystem,
  [GameStatsMeter.systemName]: gameStatsMeter,
  [KeyboardControlSystem.systemName]: keyboardControlSystem,
  [KeyboardInputSystem.systemName]: keyboardInputSystem,
  [MouseControlSystem.systemName]: mouseControlSystem,
  [MouseInputSystem.systemName]: mouseInputSystem,
  [PhysicsSystem.systemName]: physicsSystem,
  [BehaviorSystem.systemName]: behaviorSystem,
  [Renderer.systemName]: renderer,
  [UIBridge.systemName]: uiBridge,
  [AudioSystem.systemName]: audioSystem,
};
