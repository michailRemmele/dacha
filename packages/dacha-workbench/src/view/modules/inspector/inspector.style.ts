import styled from '@emotion/styled'
import { css } from '@emotion/react'

export const InspectorStyled = styled.div(({ theme }) => css`
  padding-top: 5px;

  height: 100%;

  border-left: 1px solid ${theme.colorBorder};
`)

export const TabContentStyled = styled.div`
  height: 100%;
  padding: 5px 5px 5px 10px;

  overflow-y: scroll;
`

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
