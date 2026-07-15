import type { WidgetSchema } from '../../types/widget-schema';

import { reconcileConfig } from '..';
import type { ReconcileFix, ReconcileSchemas } from '..';

// Mimics how Task 7 will apply fixes: sequentially, resolving `name:<x>` / `id:<x>`
// segments against arrays the way the store's `findIndexByKey` does. Sequential
// application is the contract, so ordering bugs between coarse and narrow fixes
// (a parent-path write clobbering an earlier nested write) surface here and only here.
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

const cameraSchema: WidgetSchema = {
  fields: [
    { name: 'zoom', type: 'number', initialValue: 1 },
    { name: 'current', type: 'boolean', initialValue: false },
  ],
};

const colliderSchema: WidgetSchema = {
  fields: [
    {
      name: 'type',
      type: 'select',
      initialValue: 'box',
      options: ['box', 'circle'],
    },
    {
      name: 'sizeX',
      type: 'number',
      initialValue: 1,
      dependency: { name: 'type', value: 'box' },
    },
    {
      name: 'radius',
      type: 'number',
      initialValue: 1,
      dependency: { name: 'type', value: 'circle' },
    },
  ],
};

const behaviorsSchema: WidgetSchema = {
  fields: [{ name: 'list', type: 'data', initialValue: [] }],
};

const schemas: ReconcileSchemas = {
  components: {
    Camera: cameraSchema,
    Collider: colliderSchema,
    Behaviors: behaviorsSchema,
  },
  systems: {
    Physics: {
      fields: [{ name: 'gravityY', type: 'number', initialValue: 980 }],
    },
  },
  globalOptions: {
    physics: {
      fields: [
        { name: 'collisionLayers', type: 'data', initialValue: [] },
        {
          name: 'collisionMatrix',
          type: 'data',
          initialValue: { default: { default: true } },
        },
      ],
    },
    // A SECOND globalOptions schema is essential: with only one, no test can produce
    // "existing group needs a fill" and "a different group is entirely missing" at the
    // same time — the exact combination that exposes coarse/narrow fix ordering bugs.
    sorting: {
      fields: [
        { name: 'layers', type: 'data', initialValue: [] },
        {
          name: 'defaultLayer',
          type: 'data',
          initialValue: { name: 'default' },
        },
      ],
    },
  },
  behaviors: {
    Patrol: { fields: [{ name: 'speed', type: 'number', initialValue: 100 }] },
  },
};

const completeSortingOptions = {
  layers: [],
  defaultLayer: { name: 'default' },
};
const completePhysicsOptions = {
  collisionLayers: [],
  collisionMatrix: { default: { default: true } },
};

const emptyConfig = {
  scenes: [],
  templates: [],
  systems: [],
  globalOptions: [],
  startSceneId: null,
};

// `schemas.globalOptions` declares `physics` and `sorting`, so any config whose
// `globalOptions` is `[]` (as in `emptyConfig`) would otherwise pick up incidental
// "create missing group" fixes. Tests that aren't about global options use this
// already-complete value to keep their expectations focused on their own scenario.
const filledGlobalOptions = [
  { name: 'physics', options: completePhysicsOptions },
  { name: 'sorting', options: completeSortingOptions },
];

describe('reconcileConfig', () => {
  it('fills missing fields on scene actor components, recursing into children', () => {
    const config = {
      ...emptyConfig,
      globalOptions: filledGlobalOptions,
      scenes: [
        {
          id: 's1',
          name: 'scene',
          actors: [
            {
              id: 'a1',
              name: 'actor',
              components: [{ name: 'Camera', config: { zoom: 3 } }],
              children: [
                {
                  id: 'a2',
                  name: 'child',
                  components: [{ name: 'Camera', config: {} }],
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    };
    const fixes = reconcileConfig(config, schemas);
    expect(fixes).toEqual([
      {
        path: [
          'scenes',
          'id:s1',
          'actors',
          'id:a1',
          'components',
          'name:Camera',
          'config',
        ],
        value: { zoom: 3, current: false },
      },
      {
        path: [
          'scenes',
          'id:s1',
          'actors',
          'id:a1',
          'children',
          'id:a2',
          'components',
          'name:Camera',
          'config',
        ],
        value: { zoom: 1, current: false },
      },
    ]);
  });

  it('produces no fix for complete configs and unknown components', () => {
    const config = {
      ...emptyConfig,
      globalOptions: filledGlobalOptions,
      scenes: [
        {
          id: 's1',
          name: 'scene',
          actors: [
            {
              id: 'a1',
              name: 'actor',
              components: [
                { name: 'Camera', config: { zoom: 1, current: true } },
                { name: 'SomethingUnknown', config: {} },
              ],
              children: [],
            },
          ],
        },
      ],
    };
    expect(reconcileConfig(config, schemas)).toEqual([]);
  });

  it('respects dependency conditions using existing values', () => {
    const config = {
      ...emptyConfig,
      globalOptions: filledGlobalOptions,
      templates: [
        {
          id: 't1',
          name: 'tpl',
          components: [{ name: 'Collider', config: { type: 'circle' } }],
          children: [],
        },
      ],
    };
    expect(reconcileConfig(config, schemas)).toEqual([
      {
        path: ['templates', 'id:t1', 'components', 'name:Collider', 'config'],
        value: { type: 'circle', radius: 1 },
      },
    ]);
  });

  it('fills system options and creates missing global option groups', () => {
    const config = {
      ...emptyConfig,
      systems: [{ name: 'Physics', options: {} }],
    };
    const fixes = reconcileConfig(config, schemas);
    expect(fixes).toContainEqual({
      path: ['systems', 'name:Physics', 'options'],
      value: { gravityY: 980 },
    });
    expect(fixes).toContainEqual({
      path: ['globalOptions'],
      value: [
        { name: 'physics', options: completePhysicsOptions },
        { name: 'sorting', options: completeSortingOptions },
      ],
    });
  });

  it('fills missing options inside existing global option groups', () => {
    const config = {
      ...emptyConfig,
      globalOptions: [
        { name: 'physics', options: { collisionLayers: [{ id: 'x' }] } },
        { name: 'sorting', options: completeSortingOptions },
      ],
    };
    expect(reconcileConfig(config, schemas)).toEqual([
      {
        path: ['globalOptions', 'name:physics', 'options'],
        value: {
          collisionLayers: [{ id: 'x' }],
          collisionMatrix: { default: { default: true } },
        },
      },
    ]);
  });

  it('heals behaviors list item options', () => {
    const config = {
      ...emptyConfig,
      globalOptions: filledGlobalOptions,
      scenes: [
        {
          id: 's1',
          name: 'scene',
          actors: [
            {
              id: 'a1',
              name: 'actor',
              components: [
                {
                  name: 'Behaviors',
                  config: { list: [{ id: 'b1', name: 'Patrol', options: {} }] },
                },
              ],
              children: [],
            },
          ],
        },
      ],
    };
    expect(reconcileConfig(config, schemas)).toEqual([
      {
        path: [
          'scenes',
          'id:s1',
          'actors',
          'id:a1',
          'components',
          'name:Behaviors',
          'config',
          'list',
          'id:b1',
          'options',
        ],
        value: { speed: 100 },
      },
    ]);
  });

  it('never shares initialValue references between entities', () => {
    const config = {
      ...emptyConfig,
      globalOptions: filledGlobalOptions,
      scenes: [
        {
          id: 's1',
          name: 'scene',
          actors: [
            {
              id: 'a1',
              name: 'x',
              components: [{ name: 'Behaviors', config: {} }],
              children: [],
            },
            {
              id: 'a2',
              name: 'y',
              components: [{ name: 'Behaviors', config: {} }],
              children: [],
            },
          ],
        },
      ],
    };
    const fixes = reconcileConfig(config, schemas);
    expect(fixes).toHaveLength(2);
    expect((fixes[0].value as { list: unknown }).list).not.toBe(
      (fixes[1].value as { list: unknown }).list,
    );
  });

  it('survives sequential application when a group needs filling and another is missing', () => {
    // The real-world regression: a release adds a field to an EXISTING globalOptions
    // schema (physics.collisionMatrix) AND introduces a brand-new group (sorting).
    // The coarse whole-array `['globalOptions']` write must be applied BEFORE the narrow
    // `['globalOptions','name:physics','options']` write, or it clobbers the heal.
    const config = {
      ...emptyConfig,
      globalOptions: [
        { name: 'physics', options: { collisionLayers: [{ id: 'x' }] } },
      ],
    };

    const fixes = reconcileConfig(config, schemas);
    const applied = applyFixes(config, fixes);

    // Assert on the END STATE after sequential application, not on the shape of `fixes` —
    // a fixes-only assertion is what let the ordering bug through in the first place.
    expect(applied.globalOptions).toEqual([
      {
        name: 'physics',
        options: {
          collisionLayers: [{ id: 'x' }],
          collisionMatrix: { default: { default: true } },
        },
      },
      { name: 'sorting', options: completeSortingOptions },
    ]);
  });
});
