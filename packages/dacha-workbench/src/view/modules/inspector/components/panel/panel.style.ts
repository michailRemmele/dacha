import styled from '@emotion/styled'
import { css, useTheme } from '@emotion/react'

export const PanelStyled = styled.div<{
  size: 'small' | 'middle'
}>(({ size }) => {
  const theme = useTheme()
  return css`
    border: 1px solid ${theme.colorBorder};

    ${size === 'middle' && css`
      border-radius: ${theme.borderRadiusLG}px;
    `}
    ${size === 'small' && css`
      border-radius: ${theme.borderRadius}px;
    `}
  `
})

export const HeadingStyled = styled.header<{
  contentless: boolean
  size: 'small' | 'middle'
}>(({ contentless, size }) => {
  const theme = useTheme()
  return css`
    display: flex;
    justify-content: space-between;
    align-items: center;

    ${size === 'middle' && css`
      padding: 2px 5px;
    `}
    ${size === 'small' && css`
      padding: 0 5px;
    `}

    ${!contentless && css`
      border-bottom: 1px solid ${theme.colorBorder};
    `}
  `
})

export const PanelContentStyled = styled.div<{
  size: 'small' | 'middle'
}>(({ size }) => {
  const theme = useTheme()
  return css`
    ${size === 'middle' && css`
      padding: 5px;
    `}
    ${size === 'small' && css`
      padding: 3px 5px;
    `}

    background-color: ${theme.colorBgContainer};
    border-radius: 0 0 ${theme.borderRadiusLG}px ${theme.borderRadiusLG}px;
  `
})

export const ButtonSmallCSS = css`
  display: flex;
  align-items: center;
  justify-content: center;

  &.ant-btn.ant-btn-icon-only {
    width: 18px;
    height: 18px;
  }
`
