import type { WidgetSchema } from '../../../../../../types/widget-schema';

import { PhysicsWidget } from './view';
import { DEFAULT_LAYER_ID } from './consts';

export const physics: WidgetSchema = {
  title: 'globalOptions.physics.title',
  view: PhysicsWidget,
  fields: [
    { name: 'collisionLayers', type: 'data', initialValue: [] },
    {
      name: 'collisionMatrix',
      type: 'data',
      initialValue: { [DEFAULT_LAYER_ID]: { [DEFAULT_LAYER_ID]: true } },
    },
  ],
};
