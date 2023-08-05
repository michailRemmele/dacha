import {
  useState,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import isEqual from 'lodash.isequal'

import { includesArray } from '../../../utils/includes-array'
import { useStore } from '../use-store'

export const useConfig = (path?: Array<string> | string): unknown => {
  const configStore = useStore()

  const parsedPath = useMemo(() => {
    if (!path) {
      return void 0
    }

    return Array.isArray(path) ? path : path.split('.')
  }, [path])
  const prevPath = useRef(parsedPath)

  const [value, setValue] = useState(parsedPath ? configStore?.get(parsedPath) : void 0)

  useEffect(() => {
    if (parsedPath !== prevPath.current) {
      prevPath.current = parsedPath
      setValue(parsedPath ? configStore?.get(parsedPath) : void 0)
    }

    const unsubscribe = configStore?.subscribe((updatePath, updateValue) => {
      if (isEqual(parsedPath, updatePath)) {
        setValue(updateValue)
      } else if (includesArray(updatePath, parsedPath) || includesArray(parsedPath, updatePath)) {
        setValue(configStore.get(parsedPath as Array<string>))
      }
    })

    return unsubscribe
  }, [parsedPath])

  return value
}
