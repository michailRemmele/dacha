import { css } from '@emotion/react'
import type { SerializedStyles } from '@emotion/react'

export const CollapseCSS = css`
  &.ant-collapse {
    margin: 5px 0;
  }

  &.ant-collapse > .ant-collapse-item > .ant-collapse-header {
    padding-top: 2px;
    padding-bottom: 2px;
  }

  & .ant-collapse-content > .ant-collapse-content-box {
    padding: 5px;
  }

  & .ant-collapse-header-text {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    padding-right: 5px;
  }
`

export const RightOutlinedCSS = (isActive?: boolean): SerializedStyles => css`
  & svg {
    transition: transform 0.24s;
  }

  ${isActive && css`
    svg {
      transform: rotate(90deg);
    }
  `}
`
