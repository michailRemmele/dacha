import React, { useContext, useMemo, FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { SceneConfig } from 'remiz'

import { EntityList } from '../entity-list'
import { EngineContext, SelectedEntityContext, SchemasContext } from '../../../../providers'
import { get, Data } from '../../../../utils/get'

import { SystemForm } from './system-form'

export const SystemList: FC = () => {
  const { t } = useTranslation()

  const { path = [] } = useContext(SelectedEntityContext)
  const { sceneContext } = useContext(EngineContext)
  const { systems: availableSystems } = useContext(SchemasContext)

  const projectConfig = sceneContext.data.projectConfig as Data

  const addedSystemsMap = useMemo(() => {
    const { systems } = get(projectConfig, path) as SceneConfig

    return systems.reduce((acc, system) => {
      acc[system.name] = true
      return acc
    }, {} as Record<string, boolean | undefined>)
  }, [projectConfig, path])

  const entities = useMemo(() => availableSystems
    .filter((system) => addedSystemsMap[system.name])
    .map((system) => ({
      id: `${path.join('.')}.${system.name}`,
      label: t(system.schema.title, { ns: system.namespace }),
      data: system,
    })), [projectConfig, path, availableSystems, addedSystemsMap])

  const options = useMemo(() => availableSystems
    .filter((system) => !addedSystemsMap[system.name])
    .map((system) => ({
      label: t(system.schema.title, { ns: system.namespace }),
      value: system.name,
    })), [availableSystems, addedSystemsMap])

  return (
    <EntityList
      entities={entities}
      component={SystemForm}
      options={options}
      placeholder={t('inspector.systemList.addNew.button.title')}
    />
  )
}
