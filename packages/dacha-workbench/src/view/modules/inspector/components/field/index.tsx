import React, {
  useContext,
  useEffect,
  useCallback,
  useState,
  useRef,
  FC,
  HTMLProps,
} from 'react'

import { EngineContext } from '../../../../providers'
import { get, Data } from '../../../../utils/get'

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

  const { sceneContext } = useContext(EngineContext)
  const projectConfig = sceneContext.data.projectConfig as Data

  useEffect(() => {
    const initialValue = get(projectConfig, path) as string
    valueRef.current = initialValue
    setValue(initialValue)
  }, [path, projectConfig])

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
