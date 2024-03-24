import { css, useTheme } from '@emotion/react'
import type { SerializedStyles } from '@emotion/react'

export const ReloadButtonCSS = (): SerializedStyles => {
  const theme = useTheme()

  return css`
    color: ${theme.colorWarningText};

    &.ant-btn:hover {
      color: ${theme.colorWarningTextHover};
    }
    &.ant-btn:active {
      color: ${theme.colorWarningTextActive};
    }
  `
}
