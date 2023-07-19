import { useCallback } from 'react'
import type { FC } from 'react'

import { MODAL_ROOT } from '../../../consts/root-nodes'

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
}) => {
  const getContainer = useCallback(() => document.getElementById(MODAL_ROOT) as HTMLElement, [])
  return (
    <ModalStyled
      wrapClassName="modal"
      width={width}
      title={title}
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      destroyOnClose
      getContainer={getContainer}
    >
      {children}
    </ModalStyled>
  )
}
