import {
  useContext,
  useMemo,
  useCallback,
  FC,
} from 'react'
import { Tree as AntdTree } from 'antd'
import type { EventDataNode } from 'antd/lib/tree'
import type { TemplateConfig } from 'remiz'

import { ListWrapper } from '../list-wrapper'
import { EngineContext, SelectedEntityContext } from '../../../../providers'
import { useConfig, useExpandedKeys } from '../../../../hooks'
import { INSPECT_ENTITY_MSG } from '../../../../../consts/message-types'
import type { ExplorerDataNode, ExpandFn, SelectFn } from '../../../../../types/tree-node'

import { parseTemplates, getKey } from './utils'

export const Tree: FC = () => {
  const { pushMessage } = useContext(EngineContext)
  const { path: selectedEntityPath } = useContext(SelectedEntityContext)

  const templates = useConfig('templates') as Array<TemplateConfig>
  const selectedEntity = useConfig(selectedEntityPath)
  const treeData = useMemo(() => parseTemplates(templates), [templates])

  const { expandedKeys, setExpandedKeys } = useExpandedKeys(treeData)

  const handleExpand = useCallback<ExpandFn>((keys) => {
    setExpandedKeys(keys as Array<string>)
  }, [])

  const handleSelect = useCallback<SelectFn>((keys, { node }) => {
    if (node.selected) {
      return
    }

    pushMessage({
      type: INSPECT_ENTITY_MSG,
      path: (node as EventDataNode<ExplorerDataNode>).path.slice(0),
    })
  }, [pushMessage])

  const selectedKey = getKey(selectedEntity, selectedEntityPath)

  return (
    <ListWrapper>
      <AntdTree.DirectoryTree
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
