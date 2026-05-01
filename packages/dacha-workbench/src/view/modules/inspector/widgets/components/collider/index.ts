import type { WidgetSchema } from '../../../../../../types/widget-schema';
import type { CollisionLayer } from '../../types/physics-system';

const PATH = ['globalOptions', 'name:physics', 'options', 'collisionLayers'];
const DEFAULT_LAYER = 'default';

export const collider: WidgetSchema = {
  fields: [
    {
      name: 'type',
      type: 'select',
      options: ['box', 'capsule', 'circle', 'segment'],
    },
    {
      name: 'sizeX',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'box',
      },
    },
    {
      name: 'sizeY',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'box',
      },
    },
    {
      name: 'radius',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'capsule|circle',
      },
    },
    {
      name: 'point1X',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'capsule|segment',
      },
    },
    {
      name: 'point1Y',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'capsule|segment',
      },
    },
    {
      name: 'point2X',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'capsule|segment',
      },
    },
    {
      name: 'point2Y',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'capsule|segment',
      },
    },
    {
      name: 'offsetX',
      type: 'number',
    },
    {
      name: 'offsetY',
      type: 'number',
    },
    {
      name: 'layer',
      type: 'select',
      options: (getState) => [
        { title: DEFAULT_LAYER, value: DEFAULT_LAYER },
        ...((getState(PATH) as CollisionLayer[]) ?? []).map((group) => ({
          title: group.name,
          value: group.id,
        })),
      ],
    },
    {
      name: 'debugColor',
      type: 'color',
    },
  ],
  getInitialState: () => ({
    type: 'box',
    sizeX: 1,
    sizeY: 1,
    offsetX: 0,
    offsetY: 0,
    layer: DEFAULT_LAYER,
    debugColor: '#4DFFB8',
  }),
};
