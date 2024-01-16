import { useContext } from 'react'

import { EngineContext } from '../../providers'
import type { Extension } from '../../../types/global'

export const useExtension = (): Required<Extension> => {
  const { scene } = useContext(EngineContext)

  return scene.context.data.extension as Required<Extension>
}
