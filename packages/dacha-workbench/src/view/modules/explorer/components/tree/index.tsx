import {
  useContext,
  useCallback,
  FC,
} from 'react'

import { EngineContext } from '../../../../providers'
import type {
  ExplorerDataNode,
} from '../../../../../types/tree-node'
import { EventType } from '../../../../../events'
import { Tree as BaseTree } from '../../../../components'

interface TreeProps {
  className?: string
  treeData: ExplorerDataNode[]
  selectedPaths?: string[][]
  inspectedKey?: string
  persistentStorageKey: string
  draggable?: boolean
  onDrop?: (sourcePaths: string[][], destinationPath: string[]) => void
  childrenFieldMap?: Record<string, string | undefined>
}

export const Tree: FC<TreeProps> = ({
  className,
  treeData,
  inspectedKey,
  selectedPaths,
  persistentStorageKey,
  draggable,
  onDrop,
  childrenFieldMap,
}) => {
  const { world } = useContext(EngineContext)

  const handleSelect = useCallback((paths: string[][]) => {
    world.dispatchEvent(EventType.SelectEntities, { paths })
  }, [world])

  const handleInspect = useCallback((path: string[] | undefined) => {
    world.dispatchEvent(EventType.InspectEntity, { path })
  }, [world])

  const handleClickOutside = useCallback(() => {
    world.dispatchEvent(EventType.SelectEntities, { paths: [] })
    world.dispatchEvent(EventType.InspectEntity, { path: undefined })
  }, [world])

  return (
    <BaseTree
      className={className}
      inspectedKey={inspectedKey}
      selectedPaths={selectedPaths}
      onSelect={handleSelect}
      onInspect={handleInspect}
      onDrop={onDrop}
      onClickOutside={handleClickOutside}
      treeData={treeData}
      draggable={draggable}
      persistentStorageKey={persistentStorageKey}
      childrenFieldMap={childrenFieldMap}
    />
  )
}
