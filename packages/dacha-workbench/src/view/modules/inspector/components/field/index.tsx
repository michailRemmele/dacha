import {
  useEffect,
  useCallback,
  useState,
  useRef,
  FC,
  HTMLProps,
} from 'react'
import isEqual from 'lodash.isequal'

import { useConfig, useCommander } from '../../../../hooks'
import { setValue as setValueCmd } from '../../../../commands'

export interface FieldProps extends Omit<HTMLProps<HTMLElement>, 'onBlur' | 'onChange'> {
  path: string[]
  onBlur?: (value: unknown) => void
  onChange?: (value: unknown) => void
  onAccept?: (value: unknown) => void
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
  onAccept = (): void => void 0,
  ...props
}) => {
  const initialValue = useConfig(path) as string
  const { dispatch } = useCommander()

  const valueRef = useRef(initialValue)
  const [value, setValue] = useState(initialValue)

  const InputComponent = component

  useEffect(() => {
    valueRef.current = initialValue
    setValue(initialValue)
  }, [initialValue])

  const handleBlur = useCallback(() => {
    onBlur(valueRef.current)
  }, [onBlur])

  const handleChange = useCallback((newValue: string) => {
    valueRef.current = newValue
    setValue(newValue)
    onChange(newValue)
  }, [onChange])

  const handleAccept = useCallback(() => {
    if (!isEqual(valueRef.current, initialValue)) {
      dispatch(setValueCmd(path, valueRef.current))
      onAccept(valueRef.current)
    }
  }, [onAccept, path, dispatch, initialValue])

  return (
    <InputComponent
      value={value}
      onBlur={handleBlur}
      onChange={handleChange}
      onAccept={handleAccept}
      {...props}
    />
  )
}
