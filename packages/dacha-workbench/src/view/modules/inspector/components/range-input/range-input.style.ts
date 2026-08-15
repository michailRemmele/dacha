import { css } from '@emotion/react'
import styled from '@emotion/styled'

export const InputRangeCSS = css`
  width: calc(100% - 12px);

  margin: 4px 6px;

  & .ant-slider-rail {
    width: calc(100% + 12px);
    margin-left: -6px;
  }

  & .ant-slider-track {
    padding-left: 6px;
    margin-left: -6px;
    box-sizing: initial;
  }
`

export const TooltipStyled = styled.div`
  text-align: center;
`
