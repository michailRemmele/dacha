import type { FC, ReactElement } from 'react';
import { Modal as AntdModal, ModalProps as AntdModalProps } from 'antd';

import { CommandScopeProvider, HotkeysScopeProvider } from '../../providers';
import { MODAL_SCOPE } from '../../../consts/scopes';

const defaultStyles: AntdModalProps['styles'] = {
  container: {
    padding: 0,
    border: '1px solid var(--ant-color-border)',
  },
  close: {
    right: '5px',
    top: '5px',
    height: '20px',
    width: '20px',
  },
  header: {
    padding: '4px 8px',
    margin: 0,
    backgroundColor: 'var(--ant-color-bg-container)',
    borderBottom: '1px solid var(--ant-color-border)',
  },
};

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
    styles={defaultStyles}
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
