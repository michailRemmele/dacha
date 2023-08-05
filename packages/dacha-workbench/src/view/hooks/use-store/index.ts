import { useContext } from 'react'

import { EngineContext } from '../../providers'
import type { Store } from '../../../store'

export const useStore = (): Store | undefined => {
  const engineContext = useContext(EngineContext)
  return engineContext?.sceneContext?.data?.configStore as Store | undefined
}
