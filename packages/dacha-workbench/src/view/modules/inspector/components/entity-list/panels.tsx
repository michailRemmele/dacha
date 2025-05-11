import { FC } from 'react'

import type { SchemasDataEntry } from '../../../../providers'

import { EntityPanel } from './entity-panel'

import type { EntityType } from './types'

export interface Panel {
  id: string
  label: string
  data: SchemasDataEntry
}

export interface PanelsProps {
  path: string[]
  panels: Panel[]
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
