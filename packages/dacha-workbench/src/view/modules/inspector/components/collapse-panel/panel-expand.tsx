import { FC } from 'react'
import { ChevronRight } from '@gravity-ui/icons'

import { Icon } from '../../../../components'
import { RightOutlinedCSS } from './collapse-panel.style'

interface PanelExpandProps {
  isActive?: boolean
  children?: JSX.Element | JSX.Element[]
}

export const PanelExpand: FC<PanelExpandProps> = ({
  isActive,
  children,
}) => (
  <>
    {children}
    <Icon
      icon={<ChevronRight />}
      css={RightOutlinedCSS(isActive)}
    />
  </>
)
