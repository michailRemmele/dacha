import styled from '@emotion/styled'
import { css } from '@emotion/react'

export const ExplorerStyled = styled.div(({ theme }) => css`
  padding-top: 5px;

  height: 100%;

  border-right: 1px solid ${theme.colorBorder};

  & .ant-tree-node-content-wrapper {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`)

export const ActionBarStyled = styled.header(({ theme }) => css`
  border-bottom: 1px solid ${theme.colorBorder};
  padding: 5px;

  height: 34px;
`)

export const ButtonCSS = css`
  &:not(:last-child) {
    margin-right: 5px;
  }
`

export const AdditionalSectionStyled = styled.div(({ theme }) => css`
  display: inline-block;

  margin-left: 3px;
  padding: 0 8px;
  border-left: 1px solid ${theme.colorBorder};
`)
