import styled from '@emotion/styled'
import { css } from '@emotion/react'

export const GridSettingsStyled = styled.div`
  display: flex;
  flex-direction: column;

  padding: 10px 10px 15px;
`

export const SettingsFieldStyled = styled.label`
  display: flex;

  & + & {
    margin-top: 10px;
  }
`

export const SettingsLabelCSS = css`
  width: 40%;
`

export const SettingsInputCSS = css`
  &.ant-input-number,
  &.ant-input {
    width: 60%;
  }
`
