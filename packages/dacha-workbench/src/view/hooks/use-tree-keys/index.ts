import {
  useState,
  useEffect,
} from 'react'
import type { DataNode } from 'antd/lib/tree'

interface TreeNode<T extends DataNode> extends DataNode {
  parent?: TreeNode<T>
}

interface UseExpandedKeysReturnType {
  expandedKeys: Array<string>
  setExpandedKeys: (keys: Array<string>) => void
}

// Provides storage of tree's expanded keys with possibility to manually set new keys
// In addition, it observes tree changes and clean deleted nodes
export const useTreeKeys = <T extends DataNode>(
  tree: Array<TreeNode<T>>,
): UseExpandedKeysReturnType => {
  const [expandedKeys, setExpandedKeys] = useState<Array<string>>([])

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

    setExpandedKeys(expandedKeys.filter((key) => !keysToDelete.has(key)))
  }, [tree])

  return { expandedKeys, setExpandedKeys }
}
