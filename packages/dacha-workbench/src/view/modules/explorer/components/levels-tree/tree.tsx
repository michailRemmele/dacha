import {
  useContext,
  useMemo,
  useCallback,
  useState,
  useEffect,
  FC,
} from 'react'
import { Tree as AntdTree } from 'antd'
import type { LevelConfig } from 'remiz'

import { persistentStorage } from '../../../../../persistent-storage'
import { ListWrapper } from '../list-wrapper'
import { EngineContext, SelectedEntityContext } from '../../../../providers'
import { useConfig, useTreeKeys } from '../../../../hooks'
import type { ExplorerDataNode, ExpandFn, SelectFn } from '../../../../../types/tree-node'
import { EventType } from '../../../../../events'
import type { SelectLevelEvent } from '../../../../../events'

import { parseLevels, getKey } from './utils'

interface TreeProps {
  className?: string
}

export const Tree: FC<TreeProps> = ({ className }) => {
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

  const { expandedKeys, setExpandedKeys } = useTreeKeys(treeData, 'explorer.tab.levels.expandedKeys')

  const handleExpand = useCallback<ExpandFn>((keys) => {
    setExpandedKeys(keys as Array<string>)
  }, [])

  const handleSelect = useCallback<SelectFn<ExplorerDataNode>>((keys, { node }) => {
    if (node.selected) {
      return
    }

    scene.dispatchEvent(EventType.InspectEntity, { path: node.path.slice(0) })
  }, [scene])

  const selectedKey = getKey(selectedEntity, selectedEntityPath)

  return (
    <ListWrapper>
      <AntdTree.DirectoryTree
        className={className}
        expandedKeys={expandedKeys}
        selectedKeys={selectedKey ? [selectedKey] : []}
        onSelect={handleSelect}
        onExpand={handleExpand}
        treeData={treeData}
        expandAction="doubleClick"
      />
    </ListWrapper>
  )
}
