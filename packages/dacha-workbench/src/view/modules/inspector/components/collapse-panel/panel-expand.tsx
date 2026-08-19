import { FC, ReactElement } from 'react'
import { ChevronRight } from '@gravity-ui/icons'

import { Icon } from '../../../../components'
import { cx } from '../../../../../utils/cx'

import styles from './collapse-panel.module.css'

interface PanelExpandProps {
  isActive?: boolean
  children?: ReactElement | ReactElement[]
}

export const PanelExpand: FC<PanelExpandProps> = ({
  isActive,
  children,
}) => (
  <>
    {children}
    <Icon
      icon={<ChevronRight />}
      className={cx(styles.expandIcon, isActive && styles.expandIconActive)}
    />
  </>
)
