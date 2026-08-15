import styled from '@emotion/styled'
import { css } from '@emotion/react'

export const ToolFeatureStyled = styled.div(({ theme }) => css`
  flex-shrink: 0;

  padding: 0 8px;

  &:last-child {
    padding-right: 0;
  }

  &:not(:last-child) {
    border-right: 1px solid ${theme.colorBorder};
  }
`)
