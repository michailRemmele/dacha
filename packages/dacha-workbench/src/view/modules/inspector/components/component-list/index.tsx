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

  const addedComponents = useMemo(() => components.reduce(
    (acc, component) => acc.add(component.name),
    new Set<string>(),
  ), [components])

  return (
    <EntityList
      entities={availableComponents}
      addedEntities={addedComponents}
      type="components"
      placeholder={t('inspector.componentList.addNew.button.title')}
      sortByAddition={false}
    />
  )
}
