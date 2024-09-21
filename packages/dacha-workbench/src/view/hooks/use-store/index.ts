import { useContext } from 'react'

import { CommandContext } from '../../providers'
import type { CommanderStore } from '../../../store'

export const useStore = (): CommanderStore => {
  const { store } = useContext(CommandContext)
  return store
}
