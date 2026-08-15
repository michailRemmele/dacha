import type { WidgetSchema } from '../../types/widget-schema';

import { reconcileConfig } from '..';
import type { ReconcileSchemas } from '..';

import { applyFixes } from './utils';

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
  assets: {},
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
  assets: [],
  startSceneId: null,
};

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
    const config = {
      ...emptyConfig,
      globalOptions: [
        { name: 'physics', options: { collisionLayers: [{ id: 'x' }] } },
      ],
    };

    const fixes = reconcileConfig(config, schemas);
    const applied = applyFixes(config, fixes);

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

  it('adds an empty assets section when missing', () => {
    const config = { scenes: [], templates: [], systems: [], globalOptions: [] };
    const fixes = reconcileConfig(config, {
      components: {}, systems: {}, globalOptions: {}, behaviors: {}, assets: {},
    });
    expect(fixes).toContainEqual({ path: ['assets'], value: [] });
  });

  it('fills missing data fields (incl. the file field) for a media asset', () => {
    const config = {
      scenes: [], templates: [], systems: [], globalOptions: [],
      assets: [{ id: 'a1', name: 'Hero', kind: 'texture', data: {} }],
    };
    const fixes = reconcileConfig(config, {
      components: {}, systems: {}, globalOptions: {}, behaviors: {},
      assets: {
        texture: {
          fields: [
            { name: 'src', type: 'file', extensions: ['png'] },
            { name: 'filterMode', type: 'string', initialValue: 'nearest' },
          ],
        },
      },
    });
    expect(fixes).toContainEqual({
      path: ['assets', 'id:a1', 'data'],
      value: { src: '', filterMode: 'nearest' },
    });
  });
});
