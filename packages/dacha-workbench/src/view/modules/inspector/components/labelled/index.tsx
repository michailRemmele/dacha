import { FC, ReactElement } from 'react'

import * as styles from './labelled.module.css'

export interface LabelledProps {
  label: string
  children: ReactElement
}

export const Labelled: FC<LabelledProps> = ({ label, children }) => (
  <label className={styles.labelled}>
    <span className={styles.label}>
      {label}
    </span>
    <span className={styles.input}>
      {children}
    </span>
  </label>
)
