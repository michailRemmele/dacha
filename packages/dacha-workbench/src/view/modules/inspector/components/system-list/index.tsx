import React, { useContext, FC } from 'react'
import type { SceneConfig } from 'remiz'

import { EntityList } from '../entity-list'
import { EngineContext, SelectedEntityContext } from '../../../../providers'
import { get, Data } from '../../../../utils/get'

import { SystemForm } from './system-form'

export const SystemList: FC = () => {
  const { path = [] } = useContext(SelectedEntityContext)
  const { sceneContext } = useContext(EngineContext)

  const projectConfig = sceneContext.data.projectConfig as Data

  const { systems } = get(projectConfig, path) as SceneConfig

  return (
    <EntityList
      entities={systems}
      component={SystemForm}
    />
  )
}
