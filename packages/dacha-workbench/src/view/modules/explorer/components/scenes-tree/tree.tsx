import {
  useContext,
  useMemo,
  useState,
  useEffect,
  FC,
} from 'react'
import type { SceneConfig } from 'dacha'

import { EngineContext, InspectedEntityContext, EntitySelectionContext } from '../../../../providers'
import { useConfig, useStore } from '../../../../hooks'
import { EventType } from '../../../../../events'
import type { SelectSceneEvent } from '../../../../../events'
import { Tree } from '../tree'
import { getSavedSelectedSceneId } from '../../../../../utils/get-saved-selected-scene-id'
import { getIdByPath } from '../../../../../utils/get-id-by-path'
import { CHILDREN_FIELD_MAP } from '../../consts'

import { parseScenes, getInspectedKey, getSelectedPaths } from './utils'

interface ScenesTreeProps {
  className?: string
  onDrop?: (sourcePaths: string[][], destinationPath: string[]) => void
}

export const ScenesTree: FC<ScenesTreeProps> = ({ className, onDrop }) => {
  const { world } = useContext(EngineContext)
  const { path: inspectedEntityPath } = useContext(InspectedEntityContext)
  const { paths: selectedEntitiesPaths } = useContext(EntitySelectionContext)
  const store = useStore()

  const scenes = useConfig('scenes') as SceneConfig[]

  const [selectedScene, setSelectedScene] = useState<string | undefined>(
    () => getSavedSelectedSceneId(store),
  )

  useEffect(() => {
    const handleSceneChange = (event: SelectSceneEvent): void => {
      if (event.sceneId !== selectedScene) {
        setSelectedScene(event.sceneId)
      }
    }

    world.addEventListener(EventType.SelectScene, handleSceneChange)

    return () => world.removeEventListener(EventType.SelectScene, handleSceneChange)
  }, [selectedScene])

  const inactiveSelectedSceneId = useMemo(() => {
    const selectedIds = selectedEntitiesPaths.map((path) => getIdByPath(path))
    return selectedScene && !selectedIds.includes(selectedScene)
      ? selectedScene
      : undefined
  }, [selectedScene, selectedEntitiesPaths])

  const treeData = useMemo(
    () => parseScenes(scenes, inactiveSelectedSceneId),
    [scenes, inactiveSelectedSceneId],
  )

  return (
    <Tree
      className={className}
      treeData={treeData}
      inspectedKey={getInspectedKey(inspectedEntityPath)}
      selectedPaths={getSelectedPaths(selectedEntitiesPaths)}
      persistentStorageKey="explorer.tab.scenes"
      draggable
      onDrop={onDrop}
      childrenFieldMap={CHILDREN_FIELD_MAP}
    />
  )
}
