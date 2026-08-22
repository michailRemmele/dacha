import type { FC, ReactElement } from 'react'

import styles from './tool-feature.module.css'

interface ToolFeatureProps {
  children: ReactElement | ReactElement[]
}

export const ToolFeature: FC<ToolFeatureProps> = ({ children }) => (
  <div className={styles.toolFeature}>
    {children}
  </div>
)
