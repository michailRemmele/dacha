import styled from '@emotion/styled'
import { css, useTheme } from '@emotion/react'
import type { SerializedStyles } from '@emotion/react'

export const EditorStyled = styled.div`
  display: flex;

  width: 100%;
  height: calc(90vh - 45px);
`

export const EditorSectionStyled = styled.section`
  display: flex;
  flex-direction: column;

  width: 67%;
`

export const StateTreeStyled = styled.section`
  display: flex;
  flex: 1;

  // timeline padding + frame padding + frame border + line height + action bar
  height: calc(100% - (15px * 2 + 31px * 2 + 20px + 34px));
`

export const FooterStyled = styled.footer(({ theme }) => css`
  width: 100%;

  border-top: 1px solid ${theme.colorBorder};
`)

export const AsideStyled = styled.aside(({ theme }) => css`
  width: 33%;

  border-left: 1px solid ${theme.colorBorder};
`)

export const TransitionListCSS = css`
  width: 50%;
  height: 100%;

  display: flex;
  flex-direction: column;
`

export const StateListCSS = (): SerializedStyles => {
  const theme = useTheme()
  return css`
    border-right: 1px solid ${theme.colorBorder};

    ${TransitionListCSS}
  `
}

export const ActionBarStyled = styled.header(({ theme }) => css`
  border-bottom: 1px solid ${theme.colorBorder};
  padding: 5px;

  height: 34px;

  flex-shrink: 0;
`)

export const ActionButtonCSS = css`
  &:not(:last-child) {
    margin-right: 5px;
  }
`

export const ListCSS = css`
  flex: 1;
  overflow-y: scroll;
`

export const TreeCSS = css`
  border-radius: 0;

  ${ListCSS}
`
