import type { WidgetSchema } from '../../../../../../types/widget-schema';
import type { CollisionLayer } from '../../types/physics-system';

const PATH = ['globalOptions', 'name:physics', 'options', 'collisionLayers'];
const DEFAULT_LAYER = 'default';

export const collider: WidgetSchema = {
  fields: [
    {
      name: 'type',
      type: 'select',
      options: ['box', 'circle'],
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
        value: 'circle',
      },
    },
    {
      name: 'centerX',
      type: 'number',
    },
    {
      name: 'centerY',
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
  ],
  getInitialState: () => ({
    type: 'box',
    sizeX: 1,
    sizeY: 1,
    centerX: 0,
    centerY: 0,
    layer: DEFAULT_LAYER,
  }),
};
