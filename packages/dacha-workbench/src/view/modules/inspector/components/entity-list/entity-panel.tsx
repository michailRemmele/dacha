import React, { useCallback, useContext, useMemo } from 'react'

import { CollapsePanel } from '../collapse-panel'
import { SelectedEntityContext } from '../../../../providers'
import { useCommander } from '../../../../hooks'
import { deleteValue } from '../../../../commands'

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
  const { dispatch } = useCommander()
  const { path = [] } = useContext(SelectedEntityContext)

  const entityPath = useMemo(() => path.concat(type, `name:${entity.data.name}`), [entity])

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
