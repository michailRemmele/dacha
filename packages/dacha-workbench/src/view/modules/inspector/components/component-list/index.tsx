import { useContext, useMemo, FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { ActorConfig } from 'dacha'

import { EntityList } from '../entity-list'
import { InspectedEntityContext, SchemasContext } from '../../../../providers'
import { useConfig } from '../../../../hooks'

export const ComponentList: FC = () => {
  const { t } = useTranslation()

  const { path = [] } = useContext(InspectedEntityContext)
  const { components: availableComponents } = useContext(SchemasContext)

  const { components = [] } = useConfig(path) as ActorConfig

  const addedComponents = useMemo(() => components.reduce(
    (acc, component) => acc.add(component.name),
    new Set<string>(),
  ), [components])

  return (
    <EntityList
      path={path}
      entities={availableComponents}
      addedEntities={addedComponents}
      type="components"
      placeholder={t('inspector.componentList.addNew.button.title')}
      sortByAddition={false}
    />
  )
}
