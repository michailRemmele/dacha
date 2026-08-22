import {
  useState,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import isEqual from 'lodash.isequal'

import { includesArray } from '../../../utils/includes-array'
import { useStore } from '../use-store'

export const useConfig = (path?: string[] | string): unknown => {
  const configStore = useStore()

  const parsedPath = useMemo(() => {
    if (!path) {
      return void 0
    }

    return Array.isArray(path) ? path : path.split('.')
  }, [path])
  const prevPath = useRef(parsedPath)
  const valueRef = useRef<unknown>(null)

  if (valueRef.current === null || parsedPath !== prevPath.current) {
    valueRef.current = parsedPath ? configStore.get(parsedPath) : undefined
    prevPath.current = parsedPath
  }

  const [, setForceRerender] = useState(0)

  useEffect(() => {
    const unsubscribe = configStore.subscribe((updatePath, updateValue) => {
      if (isEqual(parsedPath, updatePath)) {
        valueRef.current = updateValue
        setForceRerender((forceRerender) => forceRerender + 1)
      } else if (includesArray(updatePath, parsedPath) || includesArray(parsedPath, updatePath)) {
        valueRef.current = configStore.get(parsedPath as string[])
        setForceRerender((forceRerender) => forceRerender + 1)
      }
    })

    return unsubscribe
  }, [parsedPath, configStore])

  return valueRef.current
}
