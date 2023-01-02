import React, { useContext, useMemo, FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { GameObjectConfig } from 'remiz'

import { EntityList } from '../entity-list'
import { SelectedEntityContext, SchemasContext } from '../../../../providers'
import { useConfig } from '../../../../hooks'

export const ComponentList: FC = () => {
  const { t } = useTranslation()

  const { path = [] } = useContext(SelectedEntityContext)
  const { components: availableComponents } = useContext(SchemasContext)

  const { components = [] } = useConfig(path) as GameObjectConfig

  const addedComponentsMap = useMemo(() => components.reduce((acc, component) => {
    acc[component.name] = true
    return acc
  }, {} as Record<string, boolean | undefined>), [components])

  const entities = useMemo(() => availableComponents
    .filter((component) => addedComponentsMap[component.name])
    .map((component) => ({
      id: `${path.join('.')}.${component.name}`,
      label: t(component.schema.title, { ns: component.namespace }),
      data: component,
    })), [path, availableComponents, addedComponentsMap])

  const options = useMemo(() => availableComponents
    .filter((component) => !addedComponentsMap[component.name])
    .map((component) => ({
      label: t(component.schema.title, { ns: component.namespace }),
      value: component.name,
    })), [availableComponents, addedComponentsMap])

  return (
    <EntityList
      entities={entities}
      type="components"
      options={options}
      placeholder={t('inspector.componentList.addNew.button.title')}
    />
  )
}
