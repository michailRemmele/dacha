import React, { useContext, useMemo, FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { SceneConfig } from 'remiz'

import { EntityList } from '../entity-list'
import { SelectedEntityContext, SchemasContext } from '../../../../providers'
import { useConfig } from '../../../../hooks'

export const SystemList: FC = () => {
  const { t } = useTranslation()

  const { path = [] } = useContext(SelectedEntityContext)
  const { systems: availableSystems } = useContext(SchemasContext)

  const { systems } = useConfig(path) as SceneConfig

  const addedSystems = useMemo(() => systems.reduce(
    (acc, system) => acc.add(system.name),
    new Set<string>(),
  ), [systems])

  return (
    <EntityList
      entities={availableSystems}
      addedEntities={addedSystems}
      type="systems"
      placeholder={t('inspector.systemList.addNew.button.title')}
    />
  )
}
