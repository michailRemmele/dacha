import {
  useState,
  useEffect,
  useMemo,
  useContext,
  useRef,
} from 'react'
import isEqual from 'lodash.isequal'

import { EngineContext } from '../../providers'
import type { Mutator } from '../../../mutator'

export const useMutator = (path?: Array<string> | string): unknown => {
  const { sceneContext } = useContext(EngineContext)
  const mutator = sceneContext.data.mutator as Mutator

  const parsedPath = useMemo(() => {
    if (!path) {
      return void 0
    }

    return Array.isArray(path) ? path : path.split('.')
  }, [path])
  const prevPath = useRef(parsedPath)

  const [value, setValue] = useState(parsedPath ? mutator.get(parsedPath) : void 0)

  useEffect(() => {
    if (parsedPath !== prevPath.current) {
      prevPath.current = parsedPath
      setValue(parsedPath ? mutator.get(parsedPath) : void 0)
    }

    const unsubscribe = mutator.subscribe((updatePath, updateValue) => {
      if (isEqual(parsedPath, updatePath)) {
        setValue(updateValue)
      }
    })

    return unsubscribe
  }, [parsedPath])

  return value
}
