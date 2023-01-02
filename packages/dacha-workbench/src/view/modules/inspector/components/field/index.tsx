import React, {
  useEffect,
  useCallback,
  useState,
  useRef,
  FC,
  HTMLProps,
} from 'react'

import { useConfig } from '../../../../hooks'

interface FieldProps extends HTMLProps<HTMLElement> {
  path: Array<string>
  // comment: Allow to pass any component to Field
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: FC<any>
  [key: string]: unknown
}

export const Field: FC<FieldProps> = ({ component, path, ...props }) => {
  const valueRef = useRef<string>()
  const [value, setValue] = useState('')

  const InputComponent = component

  const initialValue = useConfig(path) as string

  useEffect(() => {
    valueRef.current = initialValue
    setValue(initialValue)
  }, [initialValue])

  const handleBlur = useCallback(() => {
    console.log(valueRef.current)
  }, [value])

  const handleChange = useCallback((newValue: string) => {
    valueRef.current = newValue
    setValue(newValue)
  }, [])

  return (
    <InputComponent
      value={value}
      onBlur={handleBlur}
      onChange={handleChange}
      {...props}
    />
  )
}
