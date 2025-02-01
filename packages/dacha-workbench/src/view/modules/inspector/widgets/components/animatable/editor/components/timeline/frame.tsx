import type { FC, MouseEvent } from 'react'

import { FrameButtonStyled } from './timeline.style'

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
    <FrameButtonStyled
      type="button"
      onClick={handleSelect}
      isSelected={isSelected}
      isCut={isCut}
    >
      {`Frame ${title}`}
    </FrameButtonStyled>
  )
}
