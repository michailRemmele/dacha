import React, { useCallback, useContext, useMemo } from 'react'

import { CollapsePanel } from '../collapse-panel'
import { SelectedEntityContext } from '../../../../providers'
import { useCommander } from '../../../../hooks'
import { deleteValue } from '../../../../commands'

import { EntityForm } from './entity-form'
import type { Entity, EntityType } from './types'

interface EntityPanelProps {
  entity: Entity
  type: EntityType
}

export const EntityPanel = ({
  entity,
  type,
}: EntityPanelProps): JSX.Element => {
  const { dispatch } = useCommander()
  const { path = [] } = useContext(SelectedEntityContext)

  const entityPath = useMemo(() => path.concat(type, `name:${entity.data.name}`), [entity, path, type])

  const handleDelete = useCallback(() => {
    dispatch(deleteValue(entityPath))
  }, [dispatch, entityPath])

  return (
    <CollapsePanel
      title={entity.label}
      onDelete={handleDelete}
    >
      <EntityForm {...entity} type={type} />
    </CollapsePanel>
  )
}
