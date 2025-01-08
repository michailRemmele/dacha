import { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { InspectedEntityContext } from '../../../../providers'
import type { SchemasDataEntry } from '../../../../providers'

import { EntityListStyled } from './entity-list.style'
import { EntityPicker } from './entity-picker'
import { Panels } from './panels'
import { DraggablePanels } from './draggable-panels'

import type { EntityType } from './types'

interface EntityListProps {
  entities: Array<SchemasDataEntry>
  addedEntities: Set<string>
  placeholder: string
  type: EntityType
  sortByAddition?: boolean
  onDragEntity?: (from: number, to: number) => void
  draggable?: boolean
}

export const EntityList = ({
  entities,
  addedEntities,
  placeholder,
  type,
  sortByAddition = true,
  onDragEntity,
  draggable,
}: EntityListProps): JSX.Element => {
  const { t } = useTranslation()
  const { path = [] } = useContext(InspectedEntityContext)

  const pathKey = useMemo(() => path.join('.'), [path])

  const panels = useMemo(() => {
    const entitesMap = entities.reduce((acc, entity) => {
      acc[entity.name] = entity
      return acc
    }, {} as Record<string, SchemasDataEntry>)

    const sortedEntities = sortByAddition
      ? Array.from(addedEntities).map((name) => entitesMap[name])
      : entities.filter((entity) => addedEntities.has(entity.name))

    return sortedEntities
      .map((entity) => ({
        id: `${pathKey}.${entity.name}`,
        label: t(entity.schema.title, { ns: entity.namespace }),
        data: entity,
      }))
  }, [pathKey, entities, addedEntities, sortByAddition])

  return (
    <EntityListStyled>
      {draggable && panels ? (
        <DraggablePanels
          panels={panels}
          type={type}
          onDragEntity={onDragEntity}
        />
      ) : null}

      {!draggable && panels ? <Panels panels={panels} type={type} /> : null}

      <EntityPicker
        key={pathKey}
        entities={entities}
        addedEntities={addedEntities}
        placeholder={placeholder}
        type={type}
      />
    </EntityListStyled>
  )
}
