import { useContext } from 'react'

import { EngineContext } from '../../providers'
import type { Extension } from '../../../types/global'

export const useExtension = (): Required<Extension> => {
  const { sceneContext } = useContext(EngineContext)

  return sceneContext.data.extension as Required<Extension>
}
