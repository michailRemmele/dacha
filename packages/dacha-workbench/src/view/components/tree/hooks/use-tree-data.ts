import {
  useMemo,
  useCallback,
  useContext,
} from 'react'

import { HotkeysSectionContext } from '../../../providers'
import { getIdByPath } from '../../../../utils/get-id-by-path'
import type { ExplorerDataNode } from '../../../../types/tree-node'

interface UseTreeDataReturnType {
  treeData: ExplorerDataNode[]
}

export const useTreeData = (treeData: ExplorerDataNode[]): UseTreeDataReturnType => {
  const { clipboard, isCut } = useContext(HotkeysSectionContext)

  const cutKeys = useMemo(() => {
    const keysSet = new Set<string>()

    if (!clipboard?.length || !isCut) {
      return keysSet
    }

    clipboard.forEach((path) => {
      keysSet.add(getIdByPath(path))
    })

    return keysSet
  }, [clipboard, isCut])

  const parseTreeData = useCallback((
    nodes: ExplorerDataNode[],
  ): ExplorerDataNode[] => nodes.map(({ children, className, ...node }) => ({
    ...node,
    children: children ? parseTreeData(children as ExplorerDataNode[]) : undefined,
    className: `${className ?? ''} ${cutKeys.has(String(node.key)) ? 'tree-node_cut' : ''}`,
  })), [cutKeys])

  const parsedTreeData = useMemo(
    () => parseTreeData(treeData),
    [treeData, parseTreeData],
  )

  return { treeData: parsedTreeData }
}
