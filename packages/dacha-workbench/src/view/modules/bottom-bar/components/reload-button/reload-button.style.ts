import styled from '@emotion/styled'
import { css } from '@emotion/react'

export const ReloadButtonStyled = styled.button(({ theme }) => css`
  padding: 0;
  border: none;
  background: transparent;

  cursor: pointer;

  color: ${theme.colorWarningText};

  &:hover {
    color: ${theme.colorWarningTextHover};
  }
  &:active {
    color: ${theme.colorWarningTextActive};
  }
`)

export const IconCSS = css`
  margin-right: 4px;
`
