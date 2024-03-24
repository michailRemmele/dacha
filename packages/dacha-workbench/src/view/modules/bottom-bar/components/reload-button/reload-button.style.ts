import { css, useTheme } from '@emotion/react'
import type { SerializedStyles } from '@emotion/react'

export const ReloadButtonCSS = (): SerializedStyles => {
  const theme = useTheme()

  return css`
    color: ${theme.colorWarning};

    &.ant-btn:hover {
      color: ${theme.colorWarningHover};
    }
    &.ant-btn:active {
      color: ${theme.colorWarningActive};
    }
  `
}
