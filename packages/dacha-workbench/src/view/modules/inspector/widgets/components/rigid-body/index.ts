import type { WidgetSchema } from '../../../../../../types/widget-schema'

export const rigidBody: WidgetSchema = {
  fields: [
    {
      name: 'type',
      type: 'select',
      options: [
        'dynamic',
        'static',
      ],
    },
    {
      name: 'mass',
      type: 'number',
    },
    {
      name: 'useGravity',
      type: 'boolean',
    },
    {
      name: 'isPermeable',
      type: 'boolean',
    },
    {
      name: 'ghost',
      type: 'boolean',
    },
    {
      name: 'drag',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    type: 'static',
    mass: 1,
    useGravity: false,
    isPermeable: false,
    ghost: false,
    drag: 0,
  }),
}
