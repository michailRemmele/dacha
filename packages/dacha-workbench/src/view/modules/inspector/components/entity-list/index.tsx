import React, { FC } from 'react'

import { EntityPanel } from './entity-panel'
import { EntityPicker } from './entity-picker'

import type { Entity, EntityOption } from './types'

import './style.less'

interface EntityListProps<T extends Entity> {
  entities: Array<T>
  component: FC<T>
  options: Array<EntityOption>
  placeholder: string
}

export const EntityList = <T extends Entity>({
  entities,
  component,
  options,
  placeholder,
}: EntityListProps<T>): JSX.Element => (
  <div className="entity-list">
    {entities ? entities.map((entity) => (
      <EntityPanel
        key={entity.id}
        entity={entity}
        component={component}
      />
    )) : null}

    <EntityPicker options={options} placeholder={placeholder} />
  </div>
  )
