import type { FC } from 'react'

import { CommandScopeProvider, HotkeysScopeProvider } from '../../providers'
import { MODAL_SCOPE } from '../../../consts/scopes'

import { ModalStyled } from './modal.style'

interface ModalProps {
  title: string
  open: boolean
  onCancel: () => void
  width?: string | number
  children: JSX.Element | JSX.Element[]
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
    destroyOnClose
  >
    <CommandScopeProvider name={MODAL_SCOPE}>
      <HotkeysScopeProvider name={MODAL_SCOPE}>
        {children}
      </HotkeysScopeProvider>
    </CommandScopeProvider>
  </ModalStyled>
)
