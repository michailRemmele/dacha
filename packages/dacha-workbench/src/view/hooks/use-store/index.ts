import { useContext } from 'react'

import { EngineContext } from '../../providers'
import type { Store } from '../../../store'

export const useStore = (): Store => {
  const { sceneContext } = useContext(EngineContext)
  return sceneContext.data.configStore as Store
}
