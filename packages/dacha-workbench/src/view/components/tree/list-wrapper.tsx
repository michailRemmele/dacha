import {
  useCallback,
  forwardRef,
} from 'react'

import { ListWrapperStyled } from './list-wrapper.style'

interface ListWrapperProps {
  children: JSX.Element | JSX.Element[]
  onClickOutside?: () => void
}

export const ListWrapper = forwardRef<HTMLDivElement, ListWrapperProps>(({
  children,
  onClickOutside,
}, ref) => {
  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClickOutside?.()
    }
  }, [onClickOutside])

  return (
    <ListWrapperStyled
      ref={ref}
      role="presentation"
      onClick={handleClick}
    >
      {children}
    </ListWrapperStyled>
  )
})
