import { useCallback, forwardRef, ReactElement } from 'react'

import * as styles from './list-wrapper.module.css'

interface ListWrapperProps {
  children: ReactElement | ReactElement[]
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
    <div
      ref={ref}
      className={styles.listWrapper}
      role="presentation"
      onClick={handleClick}
    >
      {children}
    </div>
  )
})
