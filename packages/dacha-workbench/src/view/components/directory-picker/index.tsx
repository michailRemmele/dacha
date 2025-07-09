import { useCallback } from 'react'
import type { FC } from 'react'

import { FilePicker } from '../file-picker'
import type { FilePickerProps } from '../file-picker'

interface DirectoryPickerProps extends FilePickerProps {
  onOpenChange?: (state: boolean) => void
}

export const DirectoryPicker: FC<DirectoryPickerProps> = ({
  onChange = (): void => void 0,
  onOpenChange = (): void => void 0,
  ...props
}) => {
  const handleClick = useCallback(() => {
    onOpenChange(true)
    void window.electron.openPathSelectionDialog()
      .then((path) => {
        if (path !== undefined) {
          onChange(path)
        }
        onOpenChange(false)
      })
  }, [onChange, onOpenChange])

  return (
    <FilePicker {...props} onChange={onChange} onOpen={handleClick} />
  )
}
