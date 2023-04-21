import React, { useCallback, FC } from 'react'

import { cn } from '../../../../../../../../utils/cn'

interface FrameProps {
  className?: string
  isSelected?: boolean
  id: string
  title: string
  onSelect: (id: string) => void
}

export const Frame: FC<FrameProps> = ({
  className = '',
  isSelected,
  id,
  title,
  onSelect = (): void => void 0,
}) => {
  const handleSelect = useCallback((() => onSelect(id)), [id])

  return (
    <button
      className={cn(
        className,
        'timeline__frame',
        isSelected && 'timeline__frame_selected',
      )}
      type="button"
      onClick={handleSelect}
    >
      {`Frame ${title}`}
    </button>
  )
}
