import { useCallback, FC } from 'react'

import { Labelled, LabelledProps } from '../labelled'
import { ColorPicker } from '../../../../components'
import type { ColorInputProps } from '../../../../../types/inputs'

export const ColorInput: FC<ColorInputProps> = ({
  onAccept = (): void => void 0,
  ...props
}) => {
  const handleOpenChange = useCallback((state: boolean) => {
    if (state === false) {
      onAccept()
    }
  }, [onAccept])

  return (
    <ColorPicker
      onOpenChange={handleOpenChange}
      {...props}
    />
  )
}

export const LabelledColorInput: FC<ColorInputProps & Omit<LabelledProps, 'children'>> = ({ label, ...props }) => (
  <Labelled label={label}>
    <ColorInput {...props} />
  </Labelled>
)
