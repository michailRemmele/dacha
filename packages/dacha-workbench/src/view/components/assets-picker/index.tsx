import { useCallback } from 'react'
import type { FC } from 'react'

import { FilePicker } from '../file-picker'
import type { FilePickerProps } from '../file-picker'

interface AssetsPickerProps extends FilePickerProps {
  onOpenChange?: (state: boolean) => void
  extensions?: string[]
}

export const AssetsPicker: FC<AssetsPickerProps> = ({
  onChange = (): void => void 0,
  onOpenChange = (): void => void 0,
  extensions,
  ...props
}) => {
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
    <FilePicker {...props} onChange={onChange} onOpen={handleClick} />
  )
}
