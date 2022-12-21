import React from 'react'

import { EntityPanel } from './entity-panel'
import { EntityPicker } from './entity-picker'

import type { Entity, EntityOption, EntityType } from './types'

import './style.less'

interface EntityListProps<T extends Entity> {
  entities: Array<T>
  options: Array<EntityOption>
  placeholder: string
  type: EntityType
}

export const EntityList = <T extends Entity>({
  entities,
  options,
  placeholder,
  type,
}: EntityListProps<T>): JSX.Element => (
  <div className="entity-list">
    {entities ? entities.map((entity) => (
      <EntityPanel
        key={entity.id}
        entity={entity}
        type={type}
      />
    )) : null}

    <EntityPicker options={options} placeholder={placeholder} />
  </div>
  )
