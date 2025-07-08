import styled from '@emotion/styled'
import { css, useTheme } from '@emotion/react'
import type { SerializedStyles } from '@emotion/react'

export const LayersStyled = styled.div`
  margin-bottom: 5px;
`

export const ButtonCSS = css`
  width: 100%;
  margin-bottom: 5px;
`

export const RemoveButtonCSS = css`
  flex-shrink: 0;
`

export const LayerStyled = styled.div`
  display: flex;
  align-items: center;
`

export const FieldWrapperStyled = styled.div`
  width: 100%;
  margin: 0 5px;
`

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
