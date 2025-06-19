import styled from '@emotion/styled'
import { css, useTheme } from '@emotion/react'
import type { SerializedStyles } from '@emotion/react'

export const CollapsePanelCSS = (noSchema: boolean): SerializedStyles => {
  const theme = useTheme()
  return css`
    ${noSchema && css`
      box-shadow: 0 0 0 2px ${theme.colorError};
      background-color: ${theme.colorErrorBg};
    `}
  `
}

export const EntityListStyled = styled.div`
  margin: 10px 0;
`

export const EntityPickerStyled = styled.div`
  display: flex;

  margin-top: 10px;
`

export const SelectCSS = css`
  width: 100%;
`

export const ButtonCSS = css`
  flex-shrink: 0;

  margin-left: 5px;
`

export const EntityFormStyled = styled.div`
  text-align: center;
`

export const DragOverlayStyled = styled.div(({ theme }) => css`
  background-color: ${theme.colorBgContainer};
  border-radius: ${theme.borderRadiusLG}px;
`)

export const HolderOutlinedCSS = (): SerializedStyles => {
  const theme = useTheme()
  return css`
    padding: 2px 1px;
    border-radius: 1px;

    margin-right: 3px;

    &:hover {
      background-color: ${theme.colorBorderSecondary};
      box-shadow: 0 0 0 2px ${theme.colorBorderSecondary};

      cursor: grab;
    }
  `
}
