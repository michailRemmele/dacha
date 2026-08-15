import styled from '@emotion/styled'
import { css, useTheme } from '@emotion/react'
import type { SerializedStyles } from '@emotion/react'

export const EntityPickerStyled = styled.div`
  display: flex;
`

export const FooterStyled = styled.div(({ theme }) => css`
  border-top: 1px solid ${theme.colorBorder};
  padding: 8px 6px 6px 6px;
  margin-top: 8px;
`)

export const SelectCSS = css`
  width: 100%;
`

export const ButtonCSS = css`
  flex-shrink: 0;

  margin-left: 5px;
`

export const FieldStyled = styled.label`
  display: flex;

  & + & {
    margin-top: 10px;
  }
`

export const ModalContentStyled = styled.div`
  padding: 5px 10px;
`

export const HeaderCSS = (): SerializedStyles => {
  const theme = useTheme()
  return css`
    display: block;
    padding: 10px 10px 0;

    color: ${theme.colorTextSecondary};
  `
}

export const HeaderIconCSS = css`
  margin-right: 5px;
`

export const ModalFooterStyled = styled.div(({ theme }) => css`
  border-top: 1px solid ${theme.colorBorder};
  padding: 8px 6px 6px 6px;

  display: flex;
  justify-content: flex-end;
`)
