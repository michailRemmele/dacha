import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { Modal } from 'antd'

export const ModalStyled = styled(Modal)(({ theme }) => css`
  & .ant-modal-content {
    padding: 0;
  }

  & .ant-modal-header {
    padding: 5px 10px;
    margin: 0;

    border-bottom: 1px solid ${theme.colorBorder};
  }

  & .ant-modal-close {
    top: 5px;
    right: 5px;
    width: 20px;
    height: 20px;
  }

  & .ant-modal-title {
    font-size: 12px;
  }

  & .ant-modal-body {
    padding: 0;
  }
`)
