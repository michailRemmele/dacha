import { useCallback, useContext, useMemo } from 'react'

import { CollapsePanel } from '../collapse-panel'
import { InspectedEntityContext } from '../../../../providers'
import { useCommander } from '../../../../hooks'
import { deleteValue } from '../../../../commands'

import { EntityForm } from './entity-form'
import type { Entity, EntityType } from './types'

export interface EntityPanelProps {
  entity: Entity
  type: EntityType
  expandExtra?: JSX.Element | Array<JSX.Element>
}

export const EntityPanel = ({
  entity,
  type,
  expandExtra,
}: EntityPanelProps): JSX.Element => {
  const { dispatch } = useCommander()
  const { path = [] } = useContext(InspectedEntityContext)

  const entityPath = useMemo(() => path.concat(type, `name:${entity.data.name}`), [entity, path, type])

  const handleDelete = useCallback(() => {
    dispatch(deleteValue(entityPath))
  }, [dispatch, entityPath])

  return (
    <CollapsePanel
      title={entity.label}
      onDelete={handleDelete}
      expandExtra={expandExtra}
    >
      <EntityForm {...entity} type={type} />
    </CollapsePanel>
  )
}
