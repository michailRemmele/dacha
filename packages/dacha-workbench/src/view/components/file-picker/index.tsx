import { useCallback } from 'react'
import type {
  FC, ChangeEvent, HTMLProps, KeyboardEventHandler,
} from 'react'
import { Input, Button, Space } from 'antd'
import { FolderOpenOutlined } from '@ant-design/icons'

import { SpaceCompactCSS, ButtonCSS } from './file-picker.style'

export interface FilePickerProps extends Omit<HTMLProps<HTMLInputElement>, 'size' | 'ref' | 'onChange'> {
  onOpen?: () => void
  onChange?: (value: string) => void
  onPressEnter?: KeyboardEventHandler<HTMLInputElement>
  value?: string
}

export const FilePicker: FC<FilePickerProps> = ({
  onChange = (): void => void 0,
  onOpen = (): void => void 0,
  ...props
}) => {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value),
    [onChange],
  )

  return (
    <Space.Compact
      css={SpaceCompactCSS}
      size="small"
    >
      <Input
        onChange={handleChange}
        {...props}
      />
      <Button
        css={ButtonCSS}
        icon={<FolderOpenOutlined />}
        onClick={onOpen}
      />
    </Space.Compact>
  )
}
