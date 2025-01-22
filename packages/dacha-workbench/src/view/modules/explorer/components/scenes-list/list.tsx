import {
  useContext,
  useMemo,
  useCallback,
  FC,
} from 'react'
import { Tree } from 'antd'
import type { EventDataNode } from 'antd/lib/tree'
import type { SceneConfig } from 'dacha'

import { ListWrapper } from '../list-wrapper'
import { EngineContext, SelectedEntityContext } from '../../../../providers'
import { useConfig } from '../../../../hooks'
import type { ExplorerDataNode, SelectFn } from '../../../../../types/tree-node'
import { EventType } from '../../../../../events'

import { parseScenes, getKey } from './utils'

interface ListProps {
  isLoaders?: boolean
}

export const List: FC<ListProps> = ({ isLoaders = false }) => {
  const { scene } = useContext(EngineContext)
  const { path: selectedEntityPath } = useContext(SelectedEntityContext)

  const scenes = useConfig(isLoaders ? 'loaders' : 'scenes') as Array<SceneConfig>
  const selectedEntity = useConfig(selectedEntityPath)
  const treeData = useMemo(() => parseScenes(scenes, isLoaders), [scenes])

  const handleSelect = useCallback<SelectFn>((keys, { node }) => {
    if (node.selected) {
      return
    }

    scene.dispatchEvent(EventType.InspectEntity, {
      path: (node as EventDataNode<ExplorerDataNode>).path.slice(0),
    })
  }, [scene])

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
