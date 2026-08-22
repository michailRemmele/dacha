import type { FC, ReactElement } from 'react';
import { Modal as AntdModal } from 'antd';

import { CommandScopeProvider, HotkeysScopeProvider } from '../../providers';
import { MODAL_SCOPE } from '../../../consts/scopes';

interface ModalProps {
  title: string;
  open: boolean;
  onCancel: () => void;
  width?: string | number;
  children: ReactElement | ReactElement[];
}

export const Modal: FC<ModalProps> = ({
  title,
  open,
  onCancel,
  width,
  children,
}) => (
  <AntdModal
    wrapClassName="modal"
    width={width}
    title={title}
    open={open}
    onCancel={onCancel}
    footer={null}
    centered
    destroyOnHidden
  >
    <CommandScopeProvider name={MODAL_SCOPE}>
      <HotkeysScopeProvider name={MODAL_SCOPE}>{children}</HotkeysScopeProvider>
    </CommandScopeProvider>
  </AntdModal>
);
