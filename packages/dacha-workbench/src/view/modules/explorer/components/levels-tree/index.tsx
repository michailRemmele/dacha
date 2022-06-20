import React, {
  useContext,
  useMemo,
  useCallback,
  useState,
  FC,
} from 'react'
import { Tree } from 'antd'
import type { TreeProps, EventDataNode } from 'antd/lib/tree'
import type { Config } from 'remiz'

import { EngineContext } from '../../../../providers'

import { parseLevels, DataNodeWithPath } from './utils'

type ExpandFn = Required<TreeProps>['onExpand']
type SelectFn = Required<TreeProps>['onSelect']

const SELECT_LEVEL_MSG = 'SELECT_LEVEL'
const INSPECT_ENTITY_MSG = 'INSPECT_ENTITY'

export const LevelsTree: FC = () => {
  const { sceneContext, pushMessage } = useContext(EngineContext)

  const [expandedKeys, setExpandedKeys] = useState<Array<string | number>>([])
  const [expandedLevel, setExpandedLevel] = useState<string | undefined>()

  const { levels } = sceneContext.data.projectConfig as Config

  const treeData = useMemo(() => parseLevels(levels), [levels])

  const handleExpand = useCallback<ExpandFn>((keys, { node }) => {
    const key = String(node.key)
    let newKeys = keys

    const isLevel = node.pos.split('-').length === 2

    if (isLevel && expandedLevel === key) {
      return
    }

    if (isLevel && expandedLevel !== key) {
      newKeys = keys.filter((expandedKey) => expandedKey !== expandedLevel)
    }

    setExpandedKeys(newKeys)

    if (isLevel) {
      setExpandedLevel(key)
      pushMessage({
        type: SELECT_LEVEL_MSG,
        name: key,
      })
    }
  }, [pushMessage, expandedLevel])

  const handleSelect = useCallback<SelectFn>((keys, { node }) => {
    if (node.selected) {
      return
    }

    pushMessage({
      type: INSPECT_ENTITY_MSG,
      path: (node as EventDataNode<DataNodeWithPath>).path.slice(0),
    })
  }, [pushMessage])

  return (
    <Tree.DirectoryTree
      expandedKeys={expandedKeys}
      onSelect={handleSelect}
      onExpand={handleExpand}
      treeData={treeData}
      expandAction="doubleClick"
    />
  )
}
