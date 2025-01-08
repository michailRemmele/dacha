import {
  useContext,
  useMemo,
  useState,
  useEffect,
  FC,
} from 'react'
import type { LevelConfig } from 'dacha'

import { EngineContext, InspectedEntityContext, EntitySelectionContext } from '../../../../providers'
import { useConfig, useStore } from '../../../../hooks'
import { EventType } from '../../../../../events'
import type { SelectLevelEvent } from '../../../../../events'
import { Tree } from '../tree'
import { getSavedSelectedLevelId } from '../../../../../utils/get-saved-selected-level-id'
import { getIdByPath } from '../../../../../utils/get-id-by-path'

import { parseLevels, getInspectedKey, getSelectedKeys } from './utils'

interface LevelsTreeProps {
  className?: string
}

export const LevelsTree: FC<LevelsTreeProps> = ({ className }) => {
  const { scene } = useContext(EngineContext)
  const { path: inspectedEntityPath } = useContext(InspectedEntityContext)
  const { paths: selectedEntitiesPaths } = useContext(EntitySelectionContext)
  const store = useStore()

  const levels = useConfig('levels') as Array<LevelConfig>

  const [selectedLevel, setSelectedLevel] = useState<string | undefined>(
    () => getSavedSelectedLevelId(store),
  )

  useEffect(() => {
    const handleLevelChange = (event: SelectLevelEvent): void => {
      if (event.levelId !== selectedLevel) {
        setSelectedLevel(event.levelId)
      }
    }

    scene.addEventListener(EventType.SelectLevel, handleLevelChange)

    return () => scene.removeEventListener(EventType.SelectLevel, handleLevelChange)
  }, [selectedLevel])

  const inactiveSelectedLevelId = useMemo(() => {
    const selectedIds = selectedEntitiesPaths.map((path) => getIdByPath(path))
    return selectedLevel && !selectedIds.includes(selectedLevel)
      ? selectedLevel
      : undefined
  }, [selectedLevel, selectedEntitiesPaths])

  const treeData = useMemo(
    () => parseLevels(levels, inactiveSelectedLevelId),
    [levels, inactiveSelectedLevelId],
  )

  return (
    <Tree
      className={className}
      treeData={treeData}
      inspectedKey={getInspectedKey(inspectedEntityPath)}
      selectedKeys={getSelectedKeys(selectedEntitiesPaths)}
      persistentStorageKey="explorer.tab.levels"
    />
  )
}
