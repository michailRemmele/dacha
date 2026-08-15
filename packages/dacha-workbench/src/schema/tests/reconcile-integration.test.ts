import * as React from 'react';

import { applyFixes } from './utils';

jest.mock('dacha/events', () => ({}));

jest.mock('../../view/providers', () => ({
  ...jest.requireActual('../../view/providers/command-provider'),
  ...jest.requireActual('../../view/providers/theme-provider'),
  ...jest.requireActual('../../view/providers/notification-provider'),
  ...jest.requireActual('../../view/providers/needs-reload-provider'),
  ...jest.requireActual('../../view/providers/hotkeys-provider'),
  EngineContext: React.createContext(null),
  EngineProvider: ({
    children,
  }: {
    children: React.ReactNode;
  }): React.ReactNode => children,
  SchemasContext: React.createContext(null),
  SchemasProvider: ({
    children,
  }: {
    children: React.ReactNode;
  }): React.ReactNode => children,
  InspectedEntityContext: React.createContext(null),
  EntityExplorerProvider: ({
    children,
  }: {
    children: React.ReactNode;
  }): React.ReactNode => children,
  EntitySelectionContext: React.createContext(null),
}));

jest.mock('../../persistent-storage', () => ({
  persistentStorage: {
    get: jest.fn(),
    set: jest.fn(),
    saveImmediately: jest.fn(),
  },
}));

jest.mock('dacha', () => ({
  Component: class Component {},
  Animatable: { componentName: 'Animatable' },
  Camera: { componentName: 'Camera' },
  Collider: { componentName: 'Collider' },
  KeyboardControl: { componentName: 'KeyboardControl' },
  MouseControl: { componentName: 'MouseControl' },
  Sprite: { componentName: 'Sprite' },
  Shape: { componentName: 'Shape' },
  BitmapText: { componentName: 'BitmapText' },
  RigidBody: { componentName: 'RigidBody' },
  Behaviors: { componentName: 'Behaviors' },
  Transform: { componentName: 'Transform' },
  AudioSource: { componentName: 'AudioSource' },
  Mesh: { componentName: 'Mesh' },
  CharacterBody: { componentName: 'CharacterBody' },
  Interpolation: { componentName: 'Interpolation' },
  Animator: { systemName: 'Animator' },
  CameraSystem: { systemName: 'CameraSystem' },
  GameStatsMeter: { systemName: 'GameStatsMeter' },
  KeyboardControlSystem: { systemName: 'KeyboardControlSystem' },
  KeyboardInputSystem: { systemName: 'KeyboardInputSystem' },
  MouseControlSystem: { systemName: 'MouseControlSystem' },
  MouseInputSystem: { systemName: 'MouseInputSystem' },
  PhysicsSystem: { systemName: 'PhysicsSystem' },
  BehaviorSystem: { systemName: 'BehaviorSystem' },
  Renderer: { systemName: 'Renderer' },
  UIBridge: { systemName: 'UIBridge' },
  AudioSystem: { systemName: 'AudioSystem' },
  CharacterController: { systemName: 'CharacterController' },
  Interpolator: { systemName: 'Interpolator' },
  Texture: { assetName: 'texture' },
  Audio: { assetName: 'audio' },
  BitmapFont: { assetName: 'bitmapFont' },
  DEFAULT_FIXED_UPDATE_RATE: 50,
  DEFAULT_MAX_FRAME_DELTA: 250,
  DEFAULT_MAX_FIXED_UPDATES_PER_FRAME: 5,
}));

import { reconcileConfig } from '..';
import type { ReconcileSchemas } from '..';
import {
  componentsSchema,
  systemsSchema,
  globalOptionsSchema,
} from '../../view/modules/inspector/widgets';

const schemas: ReconcileSchemas = {
  components: componentsSchema,
  systems: systemsSchema,
  globalOptions: globalOptionsSchema,
  behaviors: {},
  assets: {},
};

const buildDegradedConfig = (): Record<string, unknown> => ({
  scenes: [
    {
      id: 'scene-1',
      name: 'main',
      actors: [
        {
          id: 'actor-1',
          name: 'player',
          components: [
            { name: 'Collider', config: { type: 'circle' } },
            { name: 'Camera', config: {} },
            { name: 'TotallyUnknown', config: { keep: 'me' } },
          ],
          children: [],
        },
      ],
    },
  ],
  templates: [],
  systems: [],
  globalOptions: [],
  startSceneId: 'scene-1',
});

describe('reconcileConfig against real built-in widget schemas', () => {
  it('heals a degraded config end-to-end, respecting dependencies and preserving unknown data', () => {
    const degraded = buildDegradedConfig();

    const fixes = reconcileConfig(degraded, schemas);
    const healed = applyFixes(degraded, fixes);

    const actor = (healed.scenes as { actors: unknown[] }[])[0].actors[0] as {
      components: { name: string; config: Record<string, unknown> }[];
    };
    const collider = actor.components.find((c) => c.name === 'Collider')!;
    const camera = actor.components.find((c) => c.name === 'Camera')!;
    const unknown = actor.components.find((c) => c.name === 'TotallyUnknown')!;

    expect(collider.config).toEqual({
      type: 'circle',
      radius: 5,
      offsetX: 0,
      offsetY: 0,
      layer: 'default',
      debugColor: '#4DFFB8',
      disabled: false,
    });
    expect(collider.config).not.toHaveProperty('sizeX');
    expect(collider.config).not.toHaveProperty('sizeY');
    expect(collider.config).not.toHaveProperty('height');
    expect(collider.config).not.toHaveProperty('point1X');

    expect(camera.config).toEqual({ zoom: 1, current: false });

    expect(unknown.config).toEqual({ keep: 'me' });

    const groups = healed.globalOptions as {
      name: string;
      options: Record<string, unknown>;
    }[];
    expect(groups.map((g) => g.name).sort()).toEqual([
      'audioGroups',
      'performance',
      'physics',
      'sorting',
    ]);
    expect(groups.find((g) => g.name === 'audioGroups')!.options).toEqual({
      groups: [],
    });
    expect(groups.find((g) => g.name === 'performance')!.options).toEqual({
      maxFPS: 0,
      fixedUpdateRate: 50,
      maxFrameDelta: 250,
      maxFixedUpdatesPerFrame: 5,
    });
    expect(groups.find((g) => g.name === 'physics')!.options).toEqual({
      collisionLayers: [],
      collisionMatrix: { default: { default: true } },
    });
    expect(groups.find((g) => g.name === 'sorting')!.options).toEqual({
      order: 'bottomRight',
      layers: [],
    });

    expect(reconcileConfig(healed, schemas)).toEqual([]);
  });
});
