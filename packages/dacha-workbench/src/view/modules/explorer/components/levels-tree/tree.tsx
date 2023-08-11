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

import { ListWrapper } from '../list-wrapper'
import { EngineContext, SelectedEntityContext } from '../../../../providers'
import { useConfig, useExpandedKeys } from '../../../../hooks'
import { SELECT_LEVEL_MSG, INSPECT_ENTITY_MSG } from '../../../../../consts/message-types'
import type { ExplorerDataNode, ExpandFn, SelectFn } from '../../../../../types/tree-node'

import { parseLevels, getKey } from './utils'

interface TreeProps {
  className?: string
}

export const Tree: FC<TreeProps> = ({ className }) => {
  const { pushMessage } = useContext(EngineContext)
  const { path: selectedEntityPath } = useContext(SelectedEntityContext)

  const levels = useConfig('levels') as Array<LevelConfig>
  const selectedEntity = useConfig(selectedEntityPath)

  const [selectedLevel, setSelectedLevel] = useState<string | undefined>()

  useEffect(() => {
    const isDeleted = levels.every((level) => level.id !== selectedLevel)
    if (isDeleted) {
      pushMessage({
        type: SELECT_LEVEL_MSG,
        levelId: undefined,
      })
      setSelectedLevel(undefined)
    }
  }, [levels])

  const currentEntityId = (selectedEntity as { id: string } | undefined)?.id
  const inactiveSelectedLevelId = selectedLevel && selectedLevel !== currentEntityId
    ? selectedLevel
    : undefined

  const treeData = useMemo(
    () => parseLevels(levels, inactiveSelectedLevelId),
    [levels, inactiveSelectedLevelId],
  )

  const { expandedKeys, setExpandedKeys } = useExpandedKeys(treeData)

  const handleExpand = useCallback<ExpandFn>((keys) => {
    setExpandedKeys(keys as Array<string>)
  }, [])

  const handleSelect = useCallback<SelectFn<ExplorerDataNode>>((keys, { node }) => {
    if (node.selected) {
      return
    }

    const entityPath = node.path.slice(0)
    const levelId = entityPath[0] === 'levels' ? entityPath[1].split(':')[1] : undefined

    if (levelId !== undefined && levelId !== selectedLevel) {
      pushMessage({
        type: SELECT_LEVEL_MSG,
        levelId,
      })
      setSelectedLevel(levelId)
    }

    pushMessage({
      type: INSPECT_ENTITY_MSG,
      path: entityPath,
    })
  }, [pushMessage, selectedLevel])

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
