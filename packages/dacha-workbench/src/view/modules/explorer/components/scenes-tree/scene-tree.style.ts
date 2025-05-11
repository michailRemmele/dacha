import { css, useTheme } from '@emotion/react'
import type { SerializedStyles } from '@emotion/react'

export const TreeCSS = (): SerializedStyles => {
  const theme = useTheme()
  return css`
    &.ant-tree.ant-tree-directory .scenes-tree__scene_inactive.ant-tree-treenode::before,
    &.ant-tree.ant-tree-directory .scenes-tree__scene_inactive.ant-tree-treenode:hover::before {
      background: ${theme.colorBorderSecondary};
    }
  `
}
