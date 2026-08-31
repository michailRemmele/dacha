import {
  useState,
  useEffect,
  useCallback,
} from 'react'
import type { DataNode } from 'antd/lib/tree'

import { persistentStorage } from '../../../persistent-storage'
import { findPathById } from '../../../utils/find-path-by-id'

import type { TreeNode } from './types'

interface UseExpandedKeysReturnType {
  expandedKeys: string[]
  setExpandedKeys: (keys: string[]) => void
}

// Provides storage of tree's expanded keys with possibility to manually set new keys
// In addition, it observes tree changes and clean deleted nodes
export const useTreeKeys = <T extends DataNode>(
  tree: TreeNode<T>[],
  selectedKey?: string,
  persistentStorageKey?: string,
): UseExpandedKeysReturnType => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>(
    () => (persistentStorageKey ? persistentStorage.get(persistentStorageKey, []) : []),
  )

  const handleSetExpandedKeys = useCallback((keys: string[]) => {
    setExpandedKeys(keys)
    if (persistentStorageKey) {
      persistentStorage.set(persistentStorageKey, keys)
    }
  }, [persistentStorageKey])

  useEffect(() => {
    const stack = [...tree]

    const keysToDelete = new Set(expandedKeys)

    while (stack.length !== 0) {
      const node = stack.pop() as TreeNode<T>
      const key = String(node.key)

      // Delete all existed nodes from deletion set
      // and leave only missing nodes which should be removed from expanded nodes list
      if (keysToDelete.has(key)) {
        keysToDelete.delete(key)
      }

      if (node.children !== undefined) {
        node.children.map((child) => stack.push(child as TreeNode<T>))
      }
    }

    handleSetExpandedKeys(expandedKeys.filter((key) => !keysToDelete.has(key)))
  }, [tree])

  useEffect(() => {
    if (!selectedKey) {
      return
    }

    const keysSet = new Set(expandedKeys)
    const path = findPathById(tree, selectedKey, (node) => String(node.key))

    // Don't need to expand selected node
    path.pop()

    const isPathExpanded = path.every((key) => keysSet.has(key))

    if (!isPathExpanded) {
      path.forEach((key) => keysSet.add(key))
      handleSetExpandedKeys(Array.from(keysSet))
    }
  }, [selectedKey])

  return { expandedKeys, setExpandedKeys: handleSetExpandedKeys }
}
