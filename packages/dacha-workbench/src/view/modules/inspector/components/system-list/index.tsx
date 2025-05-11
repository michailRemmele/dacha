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
import { SchemasContext } from '../../../../providers'
import { useConfig, useCommander } from '../../../../hooks'
import { setValue } from '../../../../commands'

export const SystemList: FC = () => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const { systems: availableSystems } = useContext(SchemasContext)

  const systems = useConfig('systems') as SystemConfig[]

  const addedSystems = useMemo(() => systems.reduce(
    (acc, system) => acc.add(system.name),
    new Set<string>(),
  ), [systems])

  const handleDragEntity = useCallback((from: number, to: number) => {
    dispatch(setValue(['systems'], arrayMove(systems, from, to)))
  }, [systems, dispatch])

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
