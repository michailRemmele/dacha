interface TreeNode {
  children?: TreeNode[]
}

export const findPathById = <T extends TreeNode>(
  tree: T[],
  id: string,
  getId: (node: T) => string,
): string[] => {
  const stack = [...tree]
  const visited = new Set()
  const path: string[] = []

  while (stack.length !== 0) {
    const node = stack.at(-1) as T
    const currentId = getId(node)

    if (visited.has(currentId)) {
      stack.pop()
      path.pop()
      continue
    }

    path.push(currentId)
    visited.add(currentId)

    if (currentId === id) {
      break
    }

    if (node.children !== undefined) {
      node.children.map((child) => stack.push(child as T))
    }
  }

  return path
}
