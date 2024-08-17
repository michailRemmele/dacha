import {
  useContext,
  useMemo,
  useState,
  useEffect,
  FC,
} from 'react'
import type { LevelConfig } from 'remiz'

import { persistentStorage } from '../../../../../persistent-storage'
import { EngineContext, SelectedEntityContext } from '../../../../providers'
import { useConfig } from '../../../../hooks'
import { EventType } from '../../../../../events'
import type { SelectLevelEvent } from '../../../../../events'
import { Tree } from '../tree'

import { parseLevels, getKey } from './utils'

interface LevelsTreeProps {
  className?: string
}

export const LevelsTree: FC<LevelsTreeProps> = ({ className }) => {
  const { scene } = useContext(EngineContext)
  const { path: selectedEntityPath } = useContext(SelectedEntityContext)

  const levels = useConfig('levels') as Array<LevelConfig>
  const selectedEntity = useConfig(selectedEntityPath)

  const [selectedLevel, setSelectedLevel] = useState<string | undefined>(
    () => persistentStorage.get('selectedLevel'),
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

  const currentEntityId = (selectedEntity as { id: string } | undefined)?.id
  const inactiveSelectedLevelId = selectedLevel && selectedLevel !== currentEntityId
    ? selectedLevel
    : undefined

  const treeData = useMemo(
    () => parseLevels(levels, inactiveSelectedLevelId),
    [levels, inactiveSelectedLevelId],
  )

  const selectedKey = getKey(selectedEntity, selectedEntityPath)

  return (
    <Tree
      className={className}
      treeData={treeData}
      selectedKey={selectedKey}
      persistentStorageKey="explorer.tab.levels"
    />
  )
}
