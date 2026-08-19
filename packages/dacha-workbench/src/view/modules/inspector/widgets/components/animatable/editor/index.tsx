import { FC } from 'react'

import {
  StateList,
  TransitionList,
  Timeline,
  Inspector,
} from './components'

import { cx } from '../../../../../../../utils/cx'

import styles from './editor.module.css'

export const Editor: FC = () => (
  <div className={styles.editor}>
    <section className={styles.editorSection}>
      <section className={styles.stateTree}>
        <StateList className={cx(styles.column, styles.stateListColumn)} />
        <TransitionList className={styles.column} />
      </section>
      <footer className={styles.footer}>
        <Timeline />
      </footer>
    </section>
    <aside className={styles.aside}>
      <Inspector />
    </aside>
  </div>
)
