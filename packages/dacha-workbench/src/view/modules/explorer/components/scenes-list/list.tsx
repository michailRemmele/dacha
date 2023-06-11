import {
  useContext,
  useMemo,
  useCallback,
  FC,
} from 'react'
import { Tree } from 'antd'
import type { EventDataNode } from 'antd/lib/tree'
import type { SceneConfig } from 'remiz'

import { ListWrapper } from '../list-wrapper'
import { EngineContext, SelectedEntityContext } from '../../../../providers'
import { useConfig } from '../../../../hooks'
import { INSPECT_ENTITY_MSG } from '../../../../../consts/message-types'
import type { DataNodeWithPath, SelectFn } from '../../../../../types/tree-node'

import { parseScenes, getKey } from './utils'

interface ListProps {
  isLoaders?: boolean
}

export const List: FC<ListProps> = ({ isLoaders = false }) => {
  const { pushMessage } = useContext(EngineContext)
  const { path: selectedEntityPath } = useContext(SelectedEntityContext)

  const scenes = useConfig(isLoaders ? 'loaders' : 'scenes') as Array<SceneConfig>
  const selectedEntity = useConfig(selectedEntityPath)
  const treeData = useMemo(() => parseScenes(scenes, isLoaders), [scenes])

  const handleSelect = useCallback<SelectFn>((keys, { node }) => {
    if (node.selected) {
      return
    }

    pushMessage({
      type: INSPECT_ENTITY_MSG,
      path: (node as EventDataNode<DataNodeWithPath>).path.slice(0),
    })
  }, [pushMessage])

  const selectedKey = getKey(selectedEntity, selectedEntityPath, isLoaders)

  return (
    <ListWrapper>
      <Tree.DirectoryTree
        selectedKeys={selectedKey ? [selectedKey] : []}
        onSelect={handleSelect}
        treeData={treeData}
      />
    </ListWrapper>
  )
}
