import { useCallback, useMemo } from 'react'

import { CollapsePanel } from '../collapse-panel'
import { useCommander } from '../../../../hooks'
import { deleteValue } from '../../../../commands'

import { CONFIG_KEY_MAP, PATH_FIELD_MAP } from './consts'
import { EntityForm } from './entity-form'
import { CollapsePanelCSS } from './entity-list.style'
import type { Entity, EntityType } from './types'

export interface EntityPanelProps {
  path: string[]
  entity: Entity
  type: EntityType
  expandExtra?: JSX.Element | Array<JSX.Element>
}

export const EntityPanel = ({
  path,
  entity,
  type,
  expandExtra,
}: EntityPanelProps): JSX.Element => {
  const { dispatch } = useCommander()

  const entityPath = useMemo(() => path.concat(PATH_FIELD_MAP[type], `name:${entity.data.name}`), [entity, path, type])
  const widgetPath = useMemo(() => entityPath.concat(CONFIG_KEY_MAP[type]), [entityPath, type])

  const handleDelete = useCallback(() => {
    dispatch(deleteValue(entityPath))
  }, [dispatch, entityPath])

  return (
    <CollapsePanel
      css={CollapsePanelCSS(!entity.data.schema)}
      title={entity.label}
      onDelete={handleDelete}
      expandExtra={expandExtra}
    >
      <EntityForm {...entity} path={widgetPath} />
    </CollapsePanel>
  )
}
