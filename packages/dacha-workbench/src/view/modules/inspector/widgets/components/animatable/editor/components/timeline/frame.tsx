import type { FC, MouseEvent } from 'react'

import { cx } from '../../../../../../../../../utils/cx'

import styles from './timeline.module.css'

interface FrameProps {
  isSelected?: boolean
  isCut?: boolean
  id: string
  title: string
  onSelect: (id: string, event: MouseEvent<HTMLButtonElement>) => void
}

export const Frame: FC<FrameProps> = ({
  isSelected,
  isCut,
  id,
  title,
  onSelect = (): void => void 0,
}) => {
  const handleSelect = (event: MouseEvent<HTMLButtonElement>): void => onSelect(id, event)

  return (
    <button
      type="button"
      className={cx(
        styles.frameButton,
        isSelected && styles.frameButtonSelected,
        isCut && styles.frameButtonCut,
      )}
      onClick={handleSelect}
    >
      {`Frame ${title}`}
    </button>
  )
}
