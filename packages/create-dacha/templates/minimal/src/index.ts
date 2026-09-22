import {
  Engine,
  Renderer,
  CameraSystem,
  KeyboardInputSystem,
  KeyboardControlSystem,
  BehaviorSystem,
  UIBridge,
  Animator,
  Transform,
  Sprite,
  Camera,
  KeyboardControl,
  Behaviors,
  Texture,
  Animatable,
} from 'dacha';
import type {
  SystemConstructor,
  ComponentConstructor,
  BehaviorConstructor,
} from 'dacha';

import { importAll } from './import-all';

import config from '../data/data.json';

const gameComponents = importAll(
  import.meta.glob('./**/*.component.ts', { eager: true }),
) as ComponentConstructor[];
const gameSystems = importAll(
  import.meta.glob('./**/*.system.ts', { eager: true }),
) as SystemConstructor[];
const gameBehaviors = importAll(
  import.meta.glob('./**/*.behavior.ts', { eager: true }),
) as BehaviorConstructor[];

const engine = new Engine({
  config,
  systems: [
    Renderer,
    CameraSystem,
    KeyboardInputSystem,
    KeyboardControlSystem,
    BehaviorSystem,
    UIBridge,
    Animator,
    ...gameSystems,
  ],
  components: [
    Transform,
    Sprite,
    Camera,
    KeyboardControl,
    Behaviors,
    Animatable,
    ...gameComponents,
  ],
  assets: [Texture],
  resources: {
    [BehaviorSystem.systemName]: gameBehaviors,
    [UIBridge.systemName]: {
      loadUI: () => import('./ui'),
    },
  },
});

void engine.play();
