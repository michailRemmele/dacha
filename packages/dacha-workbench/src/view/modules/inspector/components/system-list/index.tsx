import {
  useContext,
  useMemo,
  useCallback,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { arrayMove } from '@dnd-kit/sortable'
import type { SystemConfig } from 'dacha'

import { EntityList } from '../entity-list'
import { InspectedEntityContext, SchemasContext } from '../../../../providers'
import { useConfig, useCommander } from '../../../../hooks'
import { setValue } from '../../../../commands'

export const SystemList: FC = () => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const { path = [] } = useContext(InspectedEntityContext)
  const { systems: availableSystems } = useContext(SchemasContext)

  const systemsPath = useMemo(() => path.concat('systems'), [path])
  const systems = useConfig(systemsPath) as Array<SystemConfig>

  const addedSystems = useMemo(() => systems.reduce(
    (acc, system) => acc.add(system.name),
    new Set<string>(),
  ), [systems])

  const handleDragEntity = useCallback((from: number, to: number) => {
    dispatch(setValue(systemsPath, arrayMove(systems, from, to)))
  }, [systems, dispatch, systemsPath])

  return (
    <EntityList
      entities={availableSystems}
      addedEntities={addedSystems}
      type="systems"
      placeholder={t('inspector.systemList.addNew.button.title')}
      draggable
      onDragEntity={handleDragEntity}
    />
  )
}
