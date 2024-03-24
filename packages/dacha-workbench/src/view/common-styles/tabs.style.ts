import { css, useTheme } from '@emotion/react'
import type { SerializedStyles } from '@emotion/react'

export const TabsCSS = (): SerializedStyles => {
  const theme = useTheme()

  return css`
    &,
    & .ant-tabs-content,
    & .ant-tabs-tabpane {
      height: 100%;
    }

    &.ant-tabs-top .ant-tabs-nav {
      margin: 0;
    }

    & .ant-tabs-nav .ant-tabs-tab {
      padding: 4px 8px;
    }

    & .ant-tabs-nav .ant-tabs-tab {
      border-color: ${theme.colorBorder};
    }

    & .ant-tabs-nav::before {
      border-color: ${theme.colorBorder};
    }
  `
}
