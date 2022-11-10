import React, { useContext, FC } from 'react'
import type { GameObjectConfig } from 'remiz'

import { EntityList } from '../entity-list'
import { EngineContext, SelectedEntityContext } from '../../../../providers'
import { get, Data } from '../../../../utils/get'

import { ComponentForm } from './component-form'

export const ComponentList: FC = () => {
  const { path = [] } = useContext(SelectedEntityContext)
  const { sceneContext } = useContext(EngineContext)

  const projectConfig = sceneContext.data.projectConfig as Data

  const { components = [] } = get(projectConfig, path) as GameObjectConfig

  return (
    <EntityList
      entities={components}
      component={ComponentForm}
    />
  )
}
