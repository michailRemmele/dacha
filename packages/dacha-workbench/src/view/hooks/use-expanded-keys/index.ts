import {
  useState,
  useEffect,
  useRef,
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
// In addition, it observes tree changes and clean deleted nodes, and expand branches with new nodes
export const useExpandedKeys = <T extends DataNode>(
  tree: Array<TreeNode<T>>,
): UseExpandedKeysReturnType => {
  const [expandedKeys, setExpandedKeys] = useState<Array<string>>([])
  const prevTreeKeys = useRef<Set<string>>()

  useEffect(() => {
    const treeKeys = new Set<string>()
    const stack = [...tree]

    const oldExpandedKeys = new Set(expandedKeys)
    const keysToDelete = new Set(expandedKeys)
    const keysToAdd = new Set<string>()

    while (stack.length !== 0) {
      const node = stack.pop() as TreeNode<T>
      const key = String(node.key)

      // Delete all existed nodes from deletion set
      // and leave only missing nodes which should be removed from expanded nodes list
      if (keysToDelete.has(key)) {
        keysToDelete.delete(key)
      }
      // If new node was added, then all ancestors of that node should be expanded
      if (prevTreeKeys.current && !prevTreeKeys.current.has(key)) {
        let { parent } = node
        while (parent !== undefined) {
          const parentKey = String(parent.key)
          if (!oldExpandedKeys.has(parentKey)) {
            keysToAdd.add(parentKey)
          }
          parent = parent.parent
        }
      }

      // Mark every node for future checks
      treeKeys.add(key)

      if (node.children !== undefined) {
        node.children.map((child) => stack.push(child as TreeNode<T>))
      }
    }

    setExpandedKeys([
      ...expandedKeys.filter((key) => !keysToDelete.has(key)),
      ...keysToAdd.values(),
    ])

    prevTreeKeys.current = treeKeys
  }, [tree])

  return { expandedKeys, setExpandedKeys }
}
