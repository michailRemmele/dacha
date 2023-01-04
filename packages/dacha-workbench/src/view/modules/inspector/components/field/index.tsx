import React, {
  useEffect,
  useCallback,
  useState,
  useRef,
  FC,
  HTMLProps,
} from 'react'

import { useConfig, useCommander } from '../../../../hooks'
import { updateFieldValue } from '../../../../commands'

interface FieldProps extends Omit<HTMLProps<HTMLElement>, 'onBlur' | 'onChange'> {
  path: Array<string>
  onBlur?: (value: unknown) => void
  onChange?: (value: unknown) => void
  // comment: Allow to pass any component to Field
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: FC<any>
  [key: string]: unknown
}

export const Field: FC<FieldProps> = ({
  component,
  path,
  onBlur = (): void => void 0,
  onChange = (): void => void 0,
  ...props
}) => {
  const valueRef = useRef<string>()
  const [value, setValue] = useState('')

  const InputComponent = component

  const initialValue = useConfig(path) as string
  const { dispatch } = useCommander()

  useEffect(() => {
    valueRef.current = initialValue
    setValue(initialValue)
  }, [initialValue])

  const handleBlur = useCallback(() => {
    dispatch(updateFieldValue(path, valueRef.current))
    onBlur(valueRef.current)
  }, [path, dispatch, onBlur])

  const handleChange = useCallback((newValue: string) => {
    valueRef.current = newValue
    setValue(newValue)
    onChange(newValue)
  }, [onChange])

  return (
    <InputComponent
      value={value}
      onBlur={handleBlur}
      onChange={handleChange}
      {...props}
    />
  )
}
