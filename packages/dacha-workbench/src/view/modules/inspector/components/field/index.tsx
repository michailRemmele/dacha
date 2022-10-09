import React, {
  useContext,
  useEffect,
  useCallback,
  useState,
  FC,
  HTMLProps,
} from 'react'

import { SelectedEntityContext } from '../../../../providers'
import { get, Data } from '../../../../utils/get'

interface FieldProps extends HTMLProps<HTMLElement> {
  name: string
  // comment: Allow to pass any component to Field
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: FC<any>
  [key: string]: unknown
}

export const Field: FC<FieldProps> = ({ component, name, ...props }) => {
  const InputComponent = component

  const { entity } = useContext(SelectedEntityContext)
  const [value, setValue] = useState('')

  useEffect(() => setValue(get(entity as Data, name.split('.')) as string), [entity])

  const handleBlur = useCallback(() => {
    console.log(value)
  }, [value])

  const handleChange = useCallback((newValue: string) => {
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
