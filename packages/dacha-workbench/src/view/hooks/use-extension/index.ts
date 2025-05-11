import { useContext } from 'react'

import { EngineContext } from '../../providers'
import type { Extension } from '../../../types/global'

export const useExtension = (): Required<Extension> => {
  const { world } = useContext(EngineContext)

  return world.data.extension as Required<Extension>
}
