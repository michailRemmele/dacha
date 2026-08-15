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
  sort?: boolean
  onDragEntity?: (from: number, to: number) => void
  draggable?: boolean
  onCreate: (name: string, path: string) => void
}

export const EntityList = ({
  path = [],
  entities,
  addedEntities,
  placeholder,
  type,
  sort = false,
  onDragEntity,
  draggable,
  onCreate,
}: EntityListProps): JSX.Element => {
  const { t } = useTranslation()

  const pathKey = useMemo(() => path.join('.'), [path])

  const panels = useMemo(() => {
    const entitesMap = entities.reduce((acc, entity) => {
      acc[entity.name] = entity
      return acc
    }, {} as Record<string, SchemasDataEntry | undefined>)

    const widgets = Array.from(addedEntities)
      .map((name) => {
        const entity = entitesMap[name]

        if (!entity) {
          return {
            id: `${pathKey}.${name}`,
            label: formatWidgetName(name),
            data: { name },
          }
        }

        return {
          id: `${pathKey}.${entity.name}`,
          label: entity.schema.title
            ? t(entity.schema.title, { ns: entity.namespace })
            : formatWidgetName(entity.name),
          data: entity,
        }
      })

    if (sort) {
      widgets.sort((a, b) => {
        const labelA = a.label.toLowerCase()
        const labelB = b.label.toLowerCase()

        if (labelA < labelB) {
          return -1
        }
        if (labelA > labelB) {
          return 1
        }
        return 0
      })
    }

    return widgets
  }, [pathKey, entities, addedEntities, sort])

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
        onCreate={onCreate}
      />
    </EntityListStyled>
  )
}
