import {
  useCallback,
  useMemo,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'

import { useCommander } from '../../../../hooks'
import { addValue } from '../../../../commands'
import type { SchemasDataEntry } from '../../../../providers'
import type { WidgetSchema } from '../../../../../types/widget-schema'
import { formatWidgetName } from '../../../../../utils/format-widget-name'
import { EntityPicker as EntityPickerComponent } from '../entity-picker'

import { EntityPickerCSS } from './entity-list.style'
import { CONFIG_KEY_MAP, PATH_FIELD_MAP } from './consts'
import type { EntityType } from './types'

interface EntityPickerProps {
  path: string[]
  entities: SchemasDataEntry[]
  addedEntities: Set<string>
  placeholder: string
  type: EntityType
  onCreate: (name: string, path: string) => void
}

export const EntityPicker: FC<EntityPickerProps> = ({
  path,
  entities,
  addedEntities,
  placeholder,
  type,
  onCreate,
}): JSX.Element => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const rootPath = useMemo(() => path.concat(PATH_FIELD_MAP[type]), [path, type])

  const options = useMemo(() => entities
    .filter((entity) => !addedEntities.has(entity.name))
    .map((entity) => ({
      label: entity.schema.title
        ? t(entity.schema.title, { ns: entity.namespace })
        : formatWidgetName(entity.name),
      value: entity.name,
    })), [entities, addedEntities])
  const schemasMap = useMemo(() => entities.reduce((acc, entity) => {
    acc[entity.name] = entity.schema
    return acc
  }, {} as Record<string, WidgetSchema>), [entities])

  const handleAdd = useCallback((value: string) => {
    dispatch(addValue(rootPath, {
      name: value,
      [CONFIG_KEY_MAP[type]]: schemasMap[value].getInitialState?.() ?? {},
    }))
  }, [schemasMap, rootPath, type])

  return (
    <EntityPickerComponent
      css={EntityPickerCSS}
      options={options}
      onAdd={handleAdd}
      onCreate={onCreate}
      placeholder={placeholder}
      type={type}
    />
  )
}
