import {
  useRef,
  useEffect,
  FC,
} from 'react'

import { Field } from '../field'
import type { FieldProps } from '../field'
import { useConfig, useCommander } from '../../../../hooks'
import { deleteValue } from '../../../../commands'

import { checkDependency } from './check-dependency'

interface DependencyFieldProps extends FieldProps {
  dependencyPath: string[]
  dependencyValue: string | number | boolean
  deleteOnHide?: boolean
}

export const DependencyField: FC<DependencyFieldProps> = ({
  path,
  dependencyPath,
  dependencyValue,
  deleteOnHide = true,
  ...props
}) => {
  const { dispatch } = useCommander()

  const dependencyCurrentValue = useConfig(dependencyPath)
  const value = useConfig(path)

  const visible = checkDependency(dependencyCurrentValue, dependencyValue)
  const visibleRef = useRef(visible)

  // dispatch inside useEffect leads to false executions
  // it should be carefully checked and dispatched ony if it is necessary
  useEffect(() => {
    if (visibleRef.current !== visible) {
      if (!visible && deleteOnHide && value !== undefined) {
        dispatch(deleteValue(path, true))
      }
      visibleRef.current = visible
    }
  }, [visible])

  if (!visible) {
    return null
  }

  return (
    <Field path={path} {...props} />
  )
}
