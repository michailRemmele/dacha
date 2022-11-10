import React, { FC } from 'react'

import { EntityPanel } from './entity-panel'

import type { Entity, ComponentProps } from './types'

import './style.less'

interface EntityListProps<T extends Entity> {
  entities: Array<T>
  component: FC<ComponentProps<T>>
}

export const EntityList = <T extends Entity>({
  entities,
  component,
}: EntityListProps<T>): JSX.Element => (
  <div className="entity-list">
    {entities ? entities.map((entity) => (
      <EntityPanel
        key={entity.name}
        entity={entity}
        component={component}
      />
    )) : null}
  </div>
  )
