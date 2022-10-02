import type { WidgetSchema } from '../../../../types/widget-schema'

export const colliderContainer: WidgetSchema = {
  title: 'components.colliderContainer.title',
  fields: [
    {
      name: 'type',
      title: 'components.colliderContainer.type.title',
      type: 'select',
      referenceId: 'types',
    },
    {
      name: 'collider.sizeX',
      title: 'components.colliderContainer.sizeX.title',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'boxCollider',
      },
    },
    {
      name: 'collider.sizeY',
      title: 'components.colliderContainer.sizeY.title',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'boxCollider',
      },
    },
    {
      name: 'collider.radius',
      title: 'components.colliderContainer.radius.title',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'circleCollider',
      },
    },
    {
      name: 'collider.centerX',
      title: 'components.colliderContainer.centerX.title',
      type: 'number',
    },
    {
      name: 'collider.centerY',
      title: 'components.colliderContainer.centerY.title',
      type: 'number',
    },
  ],
  references: {
    types: {
      items: [
        {
          title: 'components.colliderContainer.types.boxCollider.title',
          value: 'boxCollider',
        },
        {
          title: 'components.colliderContainer.types.circleCollider.title',
          value: 'circleCollider',
        },
      ],
    },
  },
}
