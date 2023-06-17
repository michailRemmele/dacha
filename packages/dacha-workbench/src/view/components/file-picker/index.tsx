import { useCallback } from 'react'
import type {
  FC, ChangeEvent, HTMLProps, KeyboardEventHandler,
} from 'react'
import { Input, Button, Space } from 'antd'
import { FolderOpenOutlined } from '@ant-design/icons'

import { SpaceCompactCSS, ButtonCSS } from './file-picker.style'

interface FilePickerProps extends Omit<HTMLProps<HTMLInputElement>, 'size' | 'ref' | 'onChange'> {
  onChange?: (value: string) => void
  onPressEnter?: KeyboardEventHandler<HTMLInputElement>
  onOpenChange?: (state: boolean) => void
  value?: string
  extensions?: Array<string>
}

export const FilePicker: FC<FilePickerProps> = ({
  onChange = (): void => void 0,
  onOpenChange = (): void => void 0,
  extensions,
  ...props
}) => {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value),
    [onChange],
  )

  const handleClick = useCallback(() => {
    onOpenChange(true)
    void window.electron.openAssetsDialog(extensions)
      .then((filePath) => {
        if (filePath !== undefined) {
          onChange(filePath)
        }
        onOpenChange(false)
      })
  }, [onChange, onOpenChange, extensions])

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
        onClick={handleClick}
      />
    </Space.Compact>
  )
}
