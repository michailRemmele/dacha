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
import { EngineContext, EntitySelectionContext } from '../../../../providers'
import { useConfig } from '../../../../hooks'
import type { ExplorerDataNode, SelectFn } from '../../../../../types/tree-node'
import { EventType } from '../../../../../events'

import { parseScenes, getSelectedKeys } from './utils'

interface ListProps {
  isLoaders?: boolean
}

export const List: FC<ListProps> = ({ isLoaders = false }) => {
  const { scene } = useContext(EngineContext)
  const { paths: selectedEntitiesPaths } = useContext(EntitySelectionContext)

  const scenes = useConfig(isLoaders ? 'loaders' : 'scenes') as Array<SceneConfig>
  const treeData = useMemo(() => parseScenes(scenes, isLoaders), [scenes])

  const handleSelect = useCallback<SelectFn>((keys, info) => {
    const node = info.node as EventDataNode<ExplorerDataNode>
    const selectedNodes = info.selectedNodes as EventDataNode<ExplorerDataNode>[]

    scene.dispatchEvent(EventType.SelectEntities, {
      paths: selectedNodes.map((selectedNode) => selectedNode.path.slice(0)),
    })
    scene.dispatchEvent(EventType.InspectEntity, {
      path: selectedNodes.length ? node.path.slice(0) : undefined,
    })
  }, [scene])

  return (
    <ListWrapper>
      <Tree.DirectoryTree
        multiple
        expandedKeys={[]}
        selectedKeys={getSelectedKeys(selectedEntitiesPaths, isLoaders)}
        onSelect={handleSelect}
        treeData={treeData}
      />
    </ListWrapper>
  )
}
