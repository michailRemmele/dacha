import { FC } from 'react'
import { RightOutlined } from '@ant-design/icons'

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
    <RightOutlined
      css={RightOutlinedCSS(isActive)}
    />
  </>
)
