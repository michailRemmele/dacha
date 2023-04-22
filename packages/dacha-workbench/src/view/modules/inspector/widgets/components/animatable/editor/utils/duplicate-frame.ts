import { v4 as uuidv4 } from 'uuid'
import type { Animation } from 'remiz'

export const duplicateFrame = (frame: Animation.FrameConfig): Animation.FrameConfig => {
  const duplicate = structuredClone(frame)
  duplicate.id = uuidv4()

  return duplicate
}
