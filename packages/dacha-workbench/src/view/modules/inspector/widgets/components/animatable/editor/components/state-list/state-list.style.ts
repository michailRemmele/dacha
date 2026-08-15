import styled from '@emotion/styled'
import { css, useTheme } from '@emotion/react'
import type { SerializedStyles } from '@emotion/react'

import { TreeCSS as BaseTreeCSS } from '../../editor.style'

export const ListItemInitialStyled = styled.span`
  margin-right: 5px;
`

export const ListItemSuffixStyled = styled.span(({ theme }) => css`
  color: ${theme.colorTextSecondary};
`)

export const TreeCSS = (isInactive: boolean): SerializedStyles => {
  const theme = useTheme()
  return css`
    ${BaseTreeCSS}

    ${isInactive && css`
      &.ant-tree.ant-tree-directory .ant-tree-treenode-selected .ant-tree-node-content-wrapper:hover::before,
      &.ant-tree.ant-tree-directory .ant-tree-treenode-selected .ant-tree-node-content-wrapper::before {
        background: ${theme.colorBorderSecondary};
      }

      &.ant-tree.ant-tree-directory .ant-tree-treenode .ant-tree-node-content-wrapper.ant-tree-node-selected,
      &.ant-tree.ant-tree-directory .ant-tree-treenode-selected .ant-tree-switcher {
        color: inherit;
      }
    `}

    & .ant-tree-treenode-selected .ant-tree-title span {
      color: inherit;
    }
  `
}
