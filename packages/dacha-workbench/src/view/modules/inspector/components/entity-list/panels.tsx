import React, { FC } from 'react'

import type { SchemasDataEntry } from '../../../../providers'

import { EntityPanel } from './entity-panel'

import type { EntityType } from './types'

export interface Panel {
  id: string
  label: string
  data: SchemasDataEntry
}

export interface PanelsProps {
  panels: Array<Panel>
  type: EntityType
}

export const Panels: FC<PanelsProps> = ({ panels, type }) => (
  <>
    {panels.map((entity) => (
      <EntityPanel
        key={entity.id}
        entity={entity}
        type={type}
      />
    ))}
  </>
)
