// This suite proves reconciliation heals a REAL, DEGRADED project config against the
// REAL built-in widget schemas end-to-end — not fixture schemas standing in for them.
//
// Importing `componentsSchema` pulls in the full widgets barrel, which (through a single
// widget, Animatable, reaching for a shared `view/components` -> `view/providers` barrel)
// transitively reaches the Electron preload bridge (`window.electron`), the engine/system
// registry, and the extension schema registry. None of that machinery is exercised by this
// test — we never render a component, we only read the plain-data `fields` arrays that are
// assembled at module-evaluation time — so, mirroring the barrel-import fix already used in
// `dependency-field.test.tsx`, we replace only the modules that pull in that machinery with
// slim stand-ins (`jest.requireActual` for the real, untouched provider submodules; inert
// stubs for the ones whose only role is wrapping JSX we never render) and mock the ESM-only
// `dacha` package (ts-jest cannot transform its `export` syntax). The schema DATA itself
// (field names, types, dependencies, initialValues) is 100% real and untouched.

import * as React from 'react';

jest.mock('dacha/events', () => ({}));

jest.mock('../../view/providers', () => ({
  ...jest.requireActual('../../view/providers/command-provider'),
  ...jest.requireActual('../../view/providers/theme-provider'),
  ...jest.requireActual('../../view/providers/notification-provider'),
  ...jest.requireActual('../../view/providers/needs-reload-provider'),
  ...jest.requireActual('../../view/providers/hotkeys-provider'),
  // These three wrap engine/extension machinery (EngineProvider reaches the full editor
  // system registry; SchemasProvider/EntityExplorerProvider close a require cycle back to
  // the widgets barrel this test is loading). Nothing under test renders them, so unlike
  // the entries above they are inert stand-ins rather than `jest.requireActual`.
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
  // A singleton with real side effects (`window.electron.loadPersistentStorage()` at
  // module-eval time). Unrelated to schema reconciliation; stubbed so importing the real
  // provider modules above doesn't require a live Electron preload bridge.
  persistentStorage: {
    get: jest.fn(),
    set: jest.fn(),
    saveImmediately: jest.fn(),
  },
}));

jest.mock('dacha', () => ({
  // Real values, copied from `node_modules/dacha/build/**` (`Component`, every
  // `*.componentName`/`*.systemName` static, and the three DEFAULT_* engine consts) so the
  // widget-schema barrels can evaluate without pulling in dacha's ESM build (which ts-jest
  // cannot transform). None of these are read by the assertions below; they only exist to
  // satisfy `class X extends Component` and `{ [SomeClass.componentName]: schema }` at
  // module-evaluation time in the real schema barrel files.
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
  DEFAULT_FIXED_UPDATE_RATE: 50,
  DEFAULT_MAX_FRAME_DELTA: 250,
  DEFAULT_MAX_FIXED_UPDATES_PER_FRAME: 5,
}));

import { reconcileConfig } from '..';
import type { ReconcileFix, ReconcileSchemas } from '..';
import {
  componentsSchema,
  systemsSchema,
} from '../../view/modules/inspector/widgets';
import { globalOptionsSchema } from '../../view/modules/inspector/widgets/global-options/schema';

// Mirrors the store's `findIndexByKey` resolution of `name:<x>` / `id:<x>` path segments,
// applying fixes sequentially exactly as `ProjectLoader.reconcileProjectConfig` does. Same
// approach as `applyFixes` in `reconcile-config.test.ts`.
const stepInto = (node: unknown, segment: string): unknown => {
  if (Array.isArray(node)) {
    const [key, value] = segment.split(':');
    return node.find(
      (item) => (item as Record<string, unknown>)[key] === value,
    );
  }
  return (node as Record<string, unknown>)[segment];
};

const setAt = (node: unknown, segment: string, value: unknown): void => {
  if (Array.isArray(node)) {
    const [key, keyValue] = segment.split(':');
    const index = node.findIndex(
      (item) => (item as Record<string, unknown>)[key] === keyValue,
    );
    node[index] = value;
  } else {
    (node as Record<string, unknown>)[segment] = value;
  }
};

const applyFixes = <T>(config: T, fixes: ReconcileFix[]): T => {
  const result = structuredClone(config);
  fixes.forEach((fix) => {
    let node: unknown = result;
    for (let i = 0; i < fix.path.length - 1; i += 1) {
      node = stepInto(node, fix.path[i]);
    }
    setAt(node, fix.path[fix.path.length - 1], structuredClone(fix.value));
  });
  return result;
};

const schemas: ReconcileSchemas = {
  components: componentsSchema,
  systems: systemsSchema,
  globalOptions: globalOptionsSchema,
  behaviors: {},
};

// A project config saved before a schema update: a Collider missing every field except its
// discriminator, a Camera saved with an empty config, no globalOptions groups at all, and a
// component the current schemas have never heard of.
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

    // The single most valuable assertion in this suite: dependency-aware healing against
    // the REAL collider schema. `type: 'circle'` must fill circle-only fields (radius) and
    // the type-agnostic ones (offsetX/offsetY/layer/debugColor/disabled), but must NOT fill
    // box-only fields (sizeX/sizeY) or the other-discriminator fields (height, point1X/Y,
    // point2X/Y) that don't apply when type is 'circle'.
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

    // Camera's empty config gets the component's full default set.
    expect(camera.config).toEqual({ zoom: 1, current: false });

    // Reconciliation must never touch data it doesn't recognize.
    expect(unknown.config).toEqual({ keep: 'me' });

    // All four global-options groups now exist, each with its schema's full default shape.
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

    // Idempotence: reconciling the already-healed config must produce zero fixes. If this
    // were not true, ProjectLoader would keep rewriting the file on every single load.
    expect(reconcileConfig(healed, schemas)).toEqual([]);
  });
});
