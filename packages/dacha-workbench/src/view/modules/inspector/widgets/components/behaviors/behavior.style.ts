import styled from '@emotion/styled'
import { css, useTheme } from '@emotion/react'
import type { SerializedStyles } from '@emotion/react'

export const BehaviorsStyled = styled.div`
  margin: 5px 0;
`

export const BehaviorFormStyled = styled.div`
  text-align: center;
`

export const PanelCSS = (noSchema: boolean): SerializedStyles => {
  const theme = useTheme()
  return css`
    ${noSchema && css`
      box-shadow: 0 0 0 2px ${theme.colorError};
      background-color: ${theme.colorErrorBg};
    `}

    margin-bottom: 5px;
  `
}

export const EntityPickerCSS = css`
  margin-top: 10px;
`
