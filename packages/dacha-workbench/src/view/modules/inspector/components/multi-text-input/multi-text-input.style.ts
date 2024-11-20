import styled from '@emotion/styled'
import { css } from '@emotion/react'

export const SelectCSS = css`
  width: 100%;

  .ant-select-selection-overflow-item > span {
    max-width: 100%;
  }
`

export const TagStyled = styled.div(({ theme }) => css`
  display: flex;

  height: 14px;
  line-height: 12px;

  padding: 0 4px;
  margin: 2px 4px 2px 0;

  background-color: ${theme.colorFillContent};
  border-radius: ${theme.borderRadiusXS}px;

  cursor: grab;
`)

export const TagTextStyled = styled.span(() => css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`)

export const CloseIconStyled = styled.span(({ theme }) => css`
  color: ${theme.colorIcon};
  font-size: ${theme.fontSizeSM}px;

  margin-left: 2px;
`)
