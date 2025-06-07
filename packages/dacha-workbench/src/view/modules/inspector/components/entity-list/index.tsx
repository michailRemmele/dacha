import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { SchemasDataEntry } from '../../../../providers'
import { formatWidgetName } from '../../../../../utils/format-widget-name'

import { EntityListStyled } from './entity-list.style'
import { EntityPicker } from './entity-picker'
import { Panels } from './panels'
import { DraggablePanels } from './draggable-panels'

import type { EntityType } from './types'

interface EntityListProps {
  path?: string[]
  entities: SchemasDataEntry[]
  addedEntities: Set<string>
  placeholder: string
  type: EntityType
  sortByAddition?: boolean
  onDragEntity?: (from: number, to: number) => void
  draggable?: boolean
}

export const EntityList = ({
  path = [],
  entities,
  addedEntities,
  placeholder,
  type,
  sortByAddition = true,
  onDragEntity,
  draggable,
}: EntityListProps): JSX.Element => {
  const { t } = useTranslation()

  const pathKey = useMemo(() => path.join('.'), [path])

  const panels = useMemo(() => {
    const entitesMap = entities.reduce((acc, entity) => {
      acc[entity.name] = entity
      return acc
    }, {} as Record<string, SchemasDataEntry>)

    const sortedEntities = sortByAddition
      ? Array.from(addedEntities).map((name) => entitesMap[name]).filter(Boolean)
      : entities.filter((entity) => addedEntities.has(entity.name))

    return sortedEntities
      .map((entity) => ({
        id: `${pathKey}.${entity.name}`,
        label: entity.schema.title
          ? t(entity.schema.title, { ns: entity.namespace })
          : formatWidgetName(entity.name),
        data: entity,
      }))
  }, [pathKey, entities, addedEntities, sortByAddition])

  return (
    <EntityListStyled>
      {draggable && panels ? (
        <DraggablePanels
          path={path}
          panels={panels}
          type={type}
          onDragEntity={onDragEntity}
        />
      ) : null}

      {!draggable && panels ? <Panels path={path} panels={panels} type={type} /> : null}

      <EntityPicker
        key={pathKey}
        path={path}
        entities={entities}
        addedEntities={addedEntities}
        placeholder={placeholder}
        type={type}
      />
    </EntityListStyled>
  )
}
