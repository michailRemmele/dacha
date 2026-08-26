import type { WidgetSchema } from '../../../../../../types/widget-schema';
import type { CollisionLayer } from '../../types/physics-system';

const PATH = ['globalOptions', 'name:physics', 'options', 'collisionLayers'];
const DEFAULT_LAYER = 'default';

export const collider: WidgetSchema = {
  icon: 'Square',
  fields: [
    {
      name: 'type',
      type: 'select',
      initialValue: 'box',
      options: ['box', 'capsule', 'circle', 'segment'],
    },
    {
      name: 'size',
      type: 'vector',
      initialValue: { x: 10, y: 10 },
      dependency: { name: 'type', value: 'box' },
    },
    {
      name: 'radius',
      type: 'number',
      initialValue: 5,
      dependency: { name: 'type', value: 'capsule|circle' },
    },
    {
      name: 'height',
      type: 'number',
      initialValue: 5,
      dependency: { name: 'type', value: 'capsule' },
    },
    {
      name: 'point1',
      type: 'vector',
      initialValue: { x: -5, y: 0 },
      dependency: { name: 'type', value: 'segment' },
    },
    {
      name: 'point2',
      type: 'vector',
      initialValue: { x: 5, y: 0 },
      dependency: { name: 'type', value: 'segment' },
    },
    {
      name: 'offset',
      type: 'vector',
      initialValue: { x: 0, y: 0 },
    },
    {
      name: 'layer',
      type: 'select',
      initialValue: DEFAULT_LAYER,
      options: (getState) => [
        { title: DEFAULT_LAYER, value: DEFAULT_LAYER },
        ...((getState(PATH) as CollisionLayer[]) ?? []).map((group) => ({
          title: group.name,
          value: group.id,
        })),
      ],
    },
    { name: 'debugColor', type: 'color', initialValue: '#4DFFB8' },
    { name: 'disabled', type: 'boolean', initialValue: false },
  ],
};
