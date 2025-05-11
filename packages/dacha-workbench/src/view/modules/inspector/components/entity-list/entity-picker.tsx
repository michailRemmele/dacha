import {
  useCallback,
  useState,
  useMemo,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { useCommander } from '../../../../hooks'
import { addValue } from '../../../../commands'
import type { SchemasDataEntry } from '../../../../providers'
import type { WidgetSchema } from '../../../../../types/widget-schema'

import {
  EntityPickerStyled,
  SelectCSS,
  ButtonCSS,
} from './entity-list.style'
import { CONFIG_KEY_MAP } from './consts'
import type { EntityType } from './types'

interface EntityPickerProps {
  path: string[]
  entities: SchemasDataEntry[]
  addedEntities: Set<string>
  placeholder: string
  type: EntityType
}

export const EntityPicker: FC<EntityPickerProps> = ({
  path,
  entities,
  addedEntities,
  placeholder,
  type,
}): JSX.Element => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const rootPath = useMemo(() => path.concat(type), [path, type])

  const options = useMemo(() => entities
    .filter((entity) => !addedEntities.has(entity.name))
    .map((entity) => ({
      label: t(entity.schema.title, { ns: entity.namespace }),
      value: entity.name,
    })), [entities, addedEntities])
  const schemasMap = useMemo(() => entities.reduce((acc, entity) => {
    acc[entity.name] = entity.schema
    return acc
  }, {} as Record<string, WidgetSchema>), [entities])

  const [value, setValue] = useState<string>()

  const handleChange = useCallback((selectedValue: string) => {
    setValue(selectedValue)
  }, [])

  const handleAdd = useCallback(() => {
    if (!value) {
      return
    }

    dispatch(addValue(rootPath, {
      name: value,
      [CONFIG_KEY_MAP[type]]: schemasMap[value].getInitialState?.() ?? {},
    }))

    setValue(undefined)
  }, [value, schemasMap, rootPath, type])

  return (
    <EntityPickerStyled>
      <Select
        css={SelectCSS}
        options={options}
        onChange={handleChange}
        value={value}
        placeholder={placeholder}
        showSearch
      />
      <Button
        css={ButtonCSS}
        icon={<PlusOutlined />}
        onClick={handleAdd}
      />
    </EntityPickerStyled>
  )
}
