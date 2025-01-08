import {
  useContext,
  useCallback,
  useEffect,
  useRef,
  FC,
} from 'react'
import type { ReactNode } from 'react'
import { Tree as AntdTree } from 'antd'

import { ListWrapper } from '../list-wrapper'
import { EngineContext } from '../../../../providers'
import { useTreeKeys } from '../../../../hooks'
import type { ExplorerDataNode, ExpandFn, SelectFn } from '../../../../../types/tree-node'
import { EventType } from '../../../../../events'
import { isScrolledIntoView } from '../../utils/is-scrolled-into-view'

interface TreeNodeTitleProps extends ExplorerDataNode {
  selected: boolean
  getContainer: () => HTMLDivElement
}

interface TreeProps {
  className?: string
  treeData: ExplorerDataNode[]
  selectedKeys?: string[]
  inspectedKey?: string
  persistentStorageKey: string
}

export const TreeNodeTitle: FC<TreeNodeTitleProps> = ({
  title,
  selected,
  getContainer,
}) => {
  const nodeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!nodeRef.current) {
      return
    }

    if (selected && !isScrolledIntoView(nodeRef.current, getContainer())) {
      nodeRef.current.scrollIntoView({ block: 'center' })
    }
  }, [selected])

  return <span ref={nodeRef}>{title as string}</span>
}

export const Tree: FC<TreeProps> = ({
  className,
  treeData,
  inspectedKey,
  selectedKeys,
  persistentStorageKey,
}) => {
  const { scene } = useContext(EngineContext)

  const containerRef = useRef<HTMLDivElement>(null)

  const { expandedKeys, setExpandedKeys } = useTreeKeys(treeData, inspectedKey, `${persistentStorageKey}.expandedKeys`)

  const handleExpand = useCallback<ExpandFn>((keys) => {
    setExpandedKeys(keys as Array<string>)
  }, [])

  const handleSelect = useCallback<SelectFn<ExplorerDataNode>>((keys, info) => {
    const { selectedNodes, node } = info

    scene.dispatchEvent(EventType.SelectEntities, {
      paths: selectedNodes.map((selectedNode) => selectedNode.path.slice(0)),
    })
    scene.dispatchEvent(EventType.InspectEntity, {
      path: selectedNodes.length ? node.path.slice(0) : undefined,
    })
  }, [scene])

  const handleDrop = useCallback(() => {
    // TODO: Implement Drag and Drop
    console.log('drop')
  }, [])

  const getContainer = useCallback(() => containerRef.current as HTMLDivElement, [])

  return (
    <ListWrapper ref={containerRef}>
      <AntdTree.DirectoryTree
        className={className}
        expandedKeys={expandedKeys}
        selectedKeys={selectedKeys}
        onSelect={handleSelect}
        onExpand={handleExpand}
        onDrop={handleDrop}
        treeData={treeData}
        expandAction="doubleClick"
        draggable={{ icon: false }}
        multiple
        titleRender={(nodeData): ReactNode => (
          <TreeNodeTitle
            {...nodeData}
            selected={selectedKeys?.includes(String(nodeData.key)) ?? false}
            getContainer={getContainer}
          />
        )}
      />
    </ListWrapper>
  )
}
