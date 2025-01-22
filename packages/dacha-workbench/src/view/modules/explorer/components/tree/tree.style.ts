import { css } from '@emotion/react'
import type { SerializedStyles } from '@emotion/react'

export const TreeCSS = (): SerializedStyles => css`
  &.ant-tree.ant-tree-directory .tree-node_cut .ant-tree-node-content-wrapper {
    opacity: 0.5;
  }
`
