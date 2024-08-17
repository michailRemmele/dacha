import type { DataNode } from 'antd/lib/tree'

import type { TreeNode } from './types'

export const findTreePath = <T extends DataNode>(
  tree: Array<TreeNode<T>>,
  nodeKey: string,
): Array<string> => {
  const stack = [...tree]
  const visited = new Set()
  const path: Array<string> = []

  while (stack.length !== 0) {
    const node = stack.at(-1) as TreeNode<T>
    const key = String(node.key)

    if (visited.has(key)) {
      stack.pop()
      path.pop()
      continue
    }

    path.push(key)
    visited.add(key)

    if (key === nodeKey) {
      break
    }

    if (node.children !== undefined) {
      node.children.map((child) => stack.push(child as TreeNode<T>))
    }
  }

  return path
}
