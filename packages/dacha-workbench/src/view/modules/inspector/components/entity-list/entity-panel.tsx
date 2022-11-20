import React, { useCallback, FC } from 'react'

import { CollapsePanel } from '../collapse-panel'

import type { Entity } from './types'

interface EntityPanelProps<T extends Entity> {
  entity: T
  component: FC<T>
}

export const EntityPanel = <T extends Entity>({
  entity,
  component: Component,
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
      <Component {...entity} />
    </CollapsePanel>
  )
}
