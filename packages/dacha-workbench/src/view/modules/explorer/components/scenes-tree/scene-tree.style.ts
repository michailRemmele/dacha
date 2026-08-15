import { css, useTheme } from '@emotion/react'
import type { SerializedStyles } from '@emotion/react'

export const TreeCSS = (): SerializedStyles => {
  const theme = useTheme()
  return css`
    &.ant-tree.ant-tree-directory .scenes-tree__scene_inactive.ant-tree-treenode .ant-tree-node-content-wrapper::before,
    &.ant-tree.ant-tree-directory .scenes-tree__scene_inactive.ant-tree-treenode .ant-tree-node-content-wrapper:hover::before {
      background: ${theme.colorBorderSecondary};
    }
  `
}
