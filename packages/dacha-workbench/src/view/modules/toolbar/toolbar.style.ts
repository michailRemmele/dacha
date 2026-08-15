import styled from '@emotion/styled'
import { css, useTheme } from '@emotion/react'
import type { SerializedStyles } from '@emotion/react'

export const ToolbarStyled = styled.div(({ theme }) => css`
  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 35px;
  padding: 0 5px;

  border-bottom: 1px solid ${theme.colorBorder};
  
  overflow: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
`)

export const RadioGroupCSS = css`
  & .ant-radio-button-wrapper {
    padding: 0 7px;
  }
`

export const ToolGroupCSS = (): SerializedStyles => {
  const theme = useTheme()

  return css`
    &.ant-radio-group {
      flex-shrink: 0;

      padding-right: 8px;
      margin-right: 8px;

      border-right: 1px solid ${theme.colorBorder};
    }

    ${RadioGroupCSS}
  `
}

export const ToolFeaturesStyled = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: baseline;

  flex-shrink: 0;
`

export const CheckboxCSS = css`
  & .ant-checkbox + span {
    padding-right: 0;
  }
`
