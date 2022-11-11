import React, { useCallback, FC } from 'react'

import { CollapsePanel } from '../collapse-panel'

import type { Entity, ComponentProps } from './types'

interface EntityPanelProps<T extends Entity> {
  entity: T
  component: FC<ComponentProps<T>>
}

export const EntityPanel = <T extends Entity>({
  entity,
  component: Component,
}: EntityPanelProps<T>): JSX.Element => {
  const handleDelete = useCallback(() => {
    // TODO: Implement entity deletion
    console.log(`Delete entity ${entity.name}`)
  }, [])

  return (
    <CollapsePanel
      key={entity.name}
      title={entity.name}
      onDelete={handleDelete}
    >
      <Component entity={entity} />
    </CollapsePanel>
  )
}
