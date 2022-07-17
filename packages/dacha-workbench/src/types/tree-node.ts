import type { TreeProps, DataNode } from 'antd/lib/tree'

export interface DataNodeWithPath extends DataNode {
  path: Array<string>
}

export type ExpandFn = Required<TreeProps>['onExpand']
export type SelectFn = Required<TreeProps>['onSelect']
