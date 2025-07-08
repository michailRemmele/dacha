import styled from '@emotion/styled'
import { css } from '@emotion/react'

export const InspectorStyled = styled.div`
  height: 100%;
`

export const HeaderStyled = styled.header(({ theme }) => `
  display: flex;
  align-items: center;

  height: 34px;

  padding: 5px 10px;
  border-bottom: 1px solid ${theme.colorBorder};
`)

export const InspectorContentStyled = styled.div`
  overflow-y: scroll;

  height: calc(100% - 34px);
`

export const FormStyled = styled.form`
  display: flex;
  flex-direction: column;

  padding: 5px 10px;
`

export const FooterStyled = styled.footer`
  display: flex;
  flex-direction: column;
`

export const ButtonCSS = css`
  margin-top: 5px;
`
