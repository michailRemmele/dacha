import { useCallback, useMemo, FC } from 'react'

import { FrameButtonStyled } from './timeline.style'

interface FrameProps {
  isSelected?: boolean
  id: string
  title: string
  onSelect: (path: Array<string>) => void
  path: Array<string>
}

export const Frame: FC<FrameProps> = ({
  isSelected,
  id,
  title,
  onSelect = (): void => void 0,
  path,
}) => {
  const framePath = useMemo(() => path.concat(`id:${id}`), [path, id])
  const handleSelect = useCallback((() => onSelect(framePath)), [framePath])

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
