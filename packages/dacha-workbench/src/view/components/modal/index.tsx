import React, { FC } from 'react'

import { ModalStyled } from './modal.style'

interface ModalProps {
  title: string
  open: boolean
  onCancel: () => void
  width?: string | number
  children: JSX.Element | Array<JSX.Element>
}

export const Modal: FC<ModalProps> = ({
  title,
  open,
  onCancel,
  width,
  children,
}) => (
  <ModalStyled
    wrapClassName="modal"
    width={width}
    title={title}
    open={open}
    onCancel={onCancel}
    footer={null}
    centered
  >
    {children}
  </ModalStyled>
)
