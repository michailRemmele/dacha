import React, {
  useContext,
  useMemo,
  useCallback,
  FC,
} from 'react'
import { Tree } from 'antd'
import type { EventDataNode } from 'antd/lib/tree'
import type { TemplateConfig } from 'remiz'

import { EngineContext, SelectedEntityContext } from '../../../../providers'
import { useMutator } from '../../../../hooks'
import { INSPECT_ENTITY_MSG } from '../../../../../consts/message-types'
import type { DataNodeWithPath, SelectFn } from '../../../../../types/tree-node'

import { parseTemplates, getKey } from './utils'

export const TemplatesTree: FC = () => {
  const { pushMessage } = useContext(EngineContext)
  const { path: selectedEntityPath } = useContext(SelectedEntityContext)

  const templates = useMutator('templates') as Array<TemplateConfig>
  const selectedEntity = useMutator(selectedEntityPath)
  const treeData = useMemo(() => parseTemplates(templates), [templates])

  const handleSelect = useCallback<SelectFn>((keys, { node }) => {
    if (node.selected) {
      return
    }

    pushMessage({
      type: INSPECT_ENTITY_MSG,
      path: (node as EventDataNode<DataNodeWithPath>).path.slice(0),
    })
  }, [pushMessage])

  const selectedKey = getKey(selectedEntity, selectedEntityPath)

  return (
    <Tree.DirectoryTree
      selectedKeys={selectedKey ? [selectedKey] : []}
      onSelect={handleSelect}
      treeData={treeData}
      expandAction="doubleClick"
    />
  )
}
