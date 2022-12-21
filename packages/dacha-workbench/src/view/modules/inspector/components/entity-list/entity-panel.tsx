import React, { useCallback } from 'react'

import { CollapsePanel } from '../collapse-panel'

import { EntityForm } from './entity-form'
import type { Entity, EntityType } from './types'

interface EntityPanelProps<T extends Entity> {
  entity: T
  type: EntityType
}

export const EntityPanel = <T extends Entity>({
  entity,
  type,
}: EntityPanelProps<T>): JSX.Element => {
  const handleDelete = useCallback(() => {
    // TODO: Implement entity deletion
    console.log(`Delete entity ${entity.data.name}`)
  }, [])

  return (
    <CollapsePanel
      title={entity.label}
      onDelete={handleDelete}
    >
      <EntityForm {...entity} type={type} />
    </CollapsePanel>
  )
}
