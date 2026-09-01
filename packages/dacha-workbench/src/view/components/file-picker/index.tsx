import { useCallback } from 'react';
import type { FC, ChangeEvent, HTMLProps, KeyboardEventHandler } from 'react';
import { Input, Button, Space, ConfigProvider } from 'antd';
import { FolderOpen } from '@gravity-ui/icons';
import { Icon } from '../icon';

import * as styles from './file-picker.module.css';

const BUTTON_THEME = {
  components: {
    Button: { defaultColor: 'var(--ant-color-text-secondary)' },
  },
};

export interface FilePickerProps extends Omit<
  HTMLProps<HTMLInputElement>,
  'size' | 'ref' | 'onChange'
> {
  onOpen?: () => void;
  onChange?: (value: string) => void;
  onPressEnter?: KeyboardEventHandler<HTMLInputElement>;
  value?: string;
}

export const FilePicker: FC<FilePickerProps> = ({
  onChange = (): void => void 0,
  onOpen = (): void => void 0,
  ...props
}) => {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value),
    [onChange],
  );

  return (
    <Space.Compact className={styles.spaceCompact}>
      <Input onChange={handleChange} {...props} />
      <ConfigProvider theme={BUTTON_THEME}>
        <Button icon={<Icon icon={<FolderOpen />} />} onClick={onOpen} />
      </ConfigProvider>
    </Space.Compact>
  );
};
