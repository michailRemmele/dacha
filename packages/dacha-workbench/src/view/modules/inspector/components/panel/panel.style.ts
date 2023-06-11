import styled from '@emotion/styled'
import { css, useTheme } from '@emotion/react'

export const PanelStyled = styled.div(() => {
  const theme = useTheme()
  return css`
    border: 1px solid ${theme.colorBorder};
    border-radius: ${theme.borderRadiusLG}px;
  `
})

export const HeadingStyled = styled.header(() => {
  const theme = useTheme()
  return css`
    display: flex;
    justify-content: space-between;

    padding: 2px 5px;

    border-bottom: 1px solid ${theme.colorBorder};
  `
})

export const PanelContentStyled = styled.div`
  padding: 5px;
`
