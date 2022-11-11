import React, { useContext, useMemo, FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { GameObjectConfig } from 'remiz'

import { EntityList } from '../entity-list'
import { EngineContext, SelectedEntityContext } from '../../../../providers'
import { get, Data } from '../../../../utils/get'

import { ComponentForm } from './component-form'

export const ComponentList: FC = () => {
  const { t } = useTranslation()

  const { path = [] } = useContext(SelectedEntityContext)
  const { sceneContext } = useContext(EngineContext)

  const projectConfig = sceneContext.data.projectConfig as Data
  const projectComponents = sceneContext.data.projectComponents as Record<string, unknown>

  const { components = [] } = get(projectConfig, path) as GameObjectConfig

  const availableComponents = useMemo(() => {
    const addedComponentsMap = components.reduce((acc, component) => {
      acc[component.name] = true
      return acc
    }, {} as Record<string, boolean | undefined>)

    return Object.keys(projectComponents)
      .filter((key: string) => !addedComponentsMap[key])
      .map((key: string) => ({ label: key, value: key }))
  }, [components])

  return (
    <EntityList
      entities={components}
      component={ComponentForm}
      options={availableComponents}
      placeholder={t('inspector.componentList.addNew.button.title')}
    />
  )
}
