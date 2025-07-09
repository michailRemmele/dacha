import { FC } from 'react'

import { EntityPanel } from './entity-panel'

import type { Entity, EntityType } from './types'

export interface PanelsProps {
  path: string[]
  panels: Entity[]
  type: EntityType
}

export const Panels: FC<PanelsProps> = ({ path, panels, type }) => (
  <>
    {panels.map((entity) => (
      <EntityPanel
        key={entity.id}
        path={path}
        entity={entity}
        type={type}
      />
    ))}
  </>
)
