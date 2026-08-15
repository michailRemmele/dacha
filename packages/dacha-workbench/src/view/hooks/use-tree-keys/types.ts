import type { DataNode } from 'antd/lib/tree'

export interface TreeNode<T extends DataNode> extends DataNode {
  parent?: TreeNode<T>
}
