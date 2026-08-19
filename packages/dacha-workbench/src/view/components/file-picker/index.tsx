import { useCallback } from 'react';
import type { FC, ChangeEvent, HTMLProps, KeyboardEventHandler } from 'react';
import { Input, Button, Space } from 'antd';
import { FolderOpen } from '@gravity-ui/icons';
import { Icon } from '../icon';

import styles from './file-picker.module.css';

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
      <Button icon={<Icon icon={<FolderOpen />} />} onClick={onOpen} />
    </Space.Compact>
  );
};
