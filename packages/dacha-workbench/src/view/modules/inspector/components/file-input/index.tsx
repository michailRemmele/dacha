import { useCallback, FC } from 'react'

import { Labelled, LabelledProps } from '../labelled'
import { FilePicker } from '../../../../components'
import type { InputProps } from '../../../../../types/inputs'

export const FileInput: FC<InputProps> = ({
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
    <FilePicker
      onOpenChange={handleOpenChange}
      onBlur={handleBlur}
      onPressEnter={onAccept}
      {...props}
    />
  )
}

export const LabelledFileInput: FC<InputProps & Omit<LabelledProps, 'children'>> = ({ label, ...props }) => (
  <Labelled label={label}>
    <FileInput {...props} />
  </Labelled>
)
