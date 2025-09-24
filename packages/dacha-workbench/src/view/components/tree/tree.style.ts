import { css, useTheme } from '@emotion/react'
import type { SerializedStyles } from '@emotion/react'

export const TreeCSS = (): SerializedStyles => {
  const theme = useTheme()
  return css`
    &.ant-tree.ant-tree-directory .tree-node_cut .ant-tree-node-content-wrapper {
      opacity: 0.5;
    }

    &.ant-tree.ant-tree-directory .ant-tree-treenode.ant-tree-treenode-draggable .ant-tree-node-content-wrapper:has(.ant-tree-drop-indicator) {
      position: static;
    }

    &.ant-tree.ant-tree-directory .ant-tree-treenode.ant-tree-treenode-draggable.drop-target .ant-tree-node-content-wrapper::before {
      background-color: ${theme.colorInfoBgHover};
      border-radius: ${theme.borderRadius}px;
    }

    &.ant-tree.ant-tree-directory .ant-tree-drop-indicator {
      display: none;
    }
  `
}
