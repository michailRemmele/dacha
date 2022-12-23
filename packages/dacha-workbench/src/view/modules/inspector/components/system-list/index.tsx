import React, { useContext, useMemo, FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { SceneConfig } from 'remiz'

import { EntityList } from '../entity-list'
import { EngineContext, SelectedEntityContext, SchemasContext } from '../../../../providers'
import type { SchemasDataEntry } from '../../../../providers'
import { get, Data } from '../../../../utils/get'

export const SystemList: FC = () => {
  const { t } = useTranslation()

  const { path = [] } = useContext(SelectedEntityContext)
  const { sceneContext } = useContext(EngineContext)
  const { systems: availableSystems } = useContext(SchemasContext)

  const projectConfig = sceneContext.data.projectConfig as Data

  const addedSystems = useMemo(() => {
    const { systems } = get(projectConfig, path) as SceneConfig
    return systems
  }, [projectConfig, path])

  const availableSystemsMap = useMemo(() => availableSystems.reduce((acc, system) => {
    acc[system.name] = system
    return acc
  }, {} as Record<string, SchemasDataEntry>), [availableSystems])
  const addedSystemsMap = useMemo(() => addedSystems.reduce((acc, system) => {
    acc[system.name] = true
    return acc
  }, {} as Record<string, boolean | undefined>), [addedSystems])

  const entities = useMemo(() => addedSystems
    .filter((system) => availableSystemsMap[system.name])
    .map((system) => {
      const systemEntry = availableSystemsMap[system.name]
      return {
        id: `${path.join('.')}.${systemEntry.name}`,
        label: t(systemEntry.schema.title, { ns: systemEntry.namespace }),
        data: systemEntry,
      }
    }), [path, addedSystems, availableSystemsMap])

  const options = useMemo(() => availableSystems
    .filter((system) => !addedSystemsMap[system.name])
    .map((system) => ({
      label: t(system.schema.title, { ns: system.namespace }),
      value: system.name,
    })), [availableSystems, addedSystemsMap])

  return (
    <EntityList
      entities={entities}
      type="systems"
      options={options}
      placeholder={t('inspector.systemList.addNew.button.title')}
    />
  )
}
