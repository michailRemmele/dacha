import { FC, ReactElement } from 'react'

import * as styles from './form.module.css'

export interface FormProps {
  children: ReactElement | (ReactElement | null)[] | null
}

export const Form: FC<FormProps> = ({ children }) => (
  <div className={styles.form}>
    {children}
  </div>
)
