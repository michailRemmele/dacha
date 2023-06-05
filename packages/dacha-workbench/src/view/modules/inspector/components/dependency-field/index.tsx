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
  dependencyPath: Array<string>
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

  const value = useConfig(dependencyPath)

  const visible = checkDependency(value, dependencyValue)
  const visibleRef = useRef(visible)

  useEffect(() => {
    if (visibleRef.current !== visible) {
      if (!visible && deleteOnHide) {
        dispatch(deleteValue(path))
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
