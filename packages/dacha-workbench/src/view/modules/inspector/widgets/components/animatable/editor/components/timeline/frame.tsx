import { useCallback, FC } from 'react'

import { FrameButtonStyled } from './timeline.style'

interface FrameProps {
  isSelected?: boolean
  id: string
  title: string
  onSelect: (id: string) => void
}

export const Frame: FC<FrameProps> = ({
  isSelected,
  id,
  title,
  onSelect = (): void => void 0,
}) => {
  const handleSelect = useCallback((() => onSelect(id)), [id])

  return (
    <FrameButtonStyled
      type="button"
      onClick={handleSelect}
      isSelected={isSelected}
    >
      {`Frame ${title}`}
    </FrameButtonStyled>
  )
}
