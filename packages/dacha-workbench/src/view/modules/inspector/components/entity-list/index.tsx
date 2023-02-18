import React, { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { SelectedEntityContext } from '../../../../providers'
import type { SchemasDataEntry } from '../../../../providers'

import { EntityPanel } from './entity-panel'
import { EntityPicker } from './entity-picker'

import type { EntityType } from './types'

import './style.less'

interface EntityListProps {
  entities: Array<SchemasDataEntry>
  addedEntities: Set<string>
  placeholder: string
  type: EntityType
  sortByAddition?: boolean
}

export const EntityList = ({
  entities,
  addedEntities,
  placeholder,
  type,
  sortByAddition = true,
}: EntityListProps): JSX.Element => {
  const { t } = useTranslation()
  const { path = [] } = useContext(SelectedEntityContext)

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
    <div className="entity-list">
      {panels ? panels.map((entity) => (
        <EntityPanel
          key={entity.id}
          entity={entity}
          type={type}
        />
      )) : null}

      <EntityPicker
        key={pathKey}
        entities={entities}
        addedEntities={addedEntities}
        placeholder={placeholder}
        type={type}
      />
    </div>
  )
}
