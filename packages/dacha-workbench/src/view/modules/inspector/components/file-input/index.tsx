import { useCallback, FC } from 'react'

import { Labelled, LabelledProps } from '../labelled'
import { AssetsPicker } from '../../../../components'
import type { FileInputProps } from '../../../../../types/inputs'

export const FileInput: FC<FileInputProps> = ({
  onAccept = (): void => void 0,
  onBlur = (): void => void 0,
  ...props
}) => {
  const handleOpenChange = useCallback((state: boolean) => {
    if (state === false) {
      onAccept()
    }
  }, [onAccept])

  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    onAccept()
    onBlur(event)
  }, [onAccept, onBlur])

  return (
    <AssetsPicker
      onOpenChange={handleOpenChange}
      onBlur={handleBlur}
      onPressEnter={onAccept}
      {...props}
    />
  )
}

export const LabelledFileInput: FC<FileInputProps & Omit<LabelledProps, 'children'>> = ({ label, ...props }) => (
  <Labelled label={label}>
    <FileInput {...props} />
  </Labelled>
)
