import type { WidgetSchema } from '../../../../types/widget-schema'

export const rigidBody: WidgetSchema = {
  title: 'components.rigidBody.title',
  fields: [
    {
      name: 'type',
      title: 'components.rigidBody.type.title',
      type: 'select',
      referenceId: 'types',
    },
    {
      name: 'mass',
      title: 'components.rigidBody.mass.title',
      type: 'number',
    },
    {
      name: 'useGravity',
      title: 'components.rigidBody.useGravity.title',
      type: 'boolean',
    },
    {
      name: 'isPermeable',
      title: 'components.rigidBody.isPermeable.title',
      type: 'boolean',
    },
    {
      name: 'ghost',
      title: 'components.rigidBody.ghost.title',
      type: 'boolean',
    },
    {
      name: 'drag',
      title: 'components.rigidBody.drag.title',
      type: 'number',
    },
  ],
  references: {
    types: {
      items: [
        {
          title: 'components.rigidBody.types.dynamic.title',
          value: 'dynamic',
        },
        {
          title: 'components.rigidBody.types.static.title',
          value: 'static',
        },
      ],
    },
  },
  getInitial: () => ({
    type: 'static',
    mass: 1,
    useGravity: false,
    isPermeable: false,
    ghost: false,
    drag: 0,
  }),
}
