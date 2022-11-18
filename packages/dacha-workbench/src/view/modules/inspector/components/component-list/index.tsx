import React, { useContext, useMemo, FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { GameObjectConfig } from 'remiz'

import { EntityList } from '../entity-list'
import { EngineContext, SelectedEntityContext, SchemasContext } from '../../../../providers'
import { get, Data } from '../../../../utils/get'

import { ComponentForm } from './component-form'

export const ComponentList: FC = () => {
  const { t } = useTranslation()

  const { path = [] } = useContext(SelectedEntityContext)
  const { sceneContext } = useContext(EngineContext)
  const { components: availableComponents } = useContext(SchemasContext)

  const projectConfig = sceneContext.data.projectConfig as Data

  const addedComponentsMap = useMemo(() => {
    const { components = [] } = get(projectConfig, path) as GameObjectConfig
    return components.reduce((acc, component) => {
      acc[component.name] = true
      return acc
    }, {} as Record<string, boolean | undefined>)
  }, [projectConfig, path])

  const entities = useMemo(() => availableComponents
    .filter((component) => addedComponentsMap[component.name])
    .map((component) => ({
      id: `${path.join('.')}.${component.name}`,
      label: t(`${component.namespace}.${component.schema.title}`),
      data: component,
    })), [projectConfig, path, availableComponents, addedComponentsMap])

  const options = useMemo(() => availableComponents
    .filter((component) => !addedComponentsMap[component.name])
    .map((component) => ({
      label: t(`${component.namespace}.${component.schema.title}`),
      value: component.name,
    })), [availableComponents, addedComponentsMap])

  return (
    <EntityList
      entities={entities}
      component={ComponentForm}
      options={options}
      placeholder={t('inspector.componentList.addNew.button.title')}
    />
  )
}
