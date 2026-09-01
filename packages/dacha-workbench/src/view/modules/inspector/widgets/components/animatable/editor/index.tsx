import { FC } from 'react';

import { StateList, TransitionList, Timeline, Inspector } from './components';

import { Window } from '../../../../../../components';

import * as styles from './editor.module.css';

export const Editor: FC = () => (
  <div className={styles.editor}>
    <section className={styles.editorSection}>
      <section className={styles.stateTree}>
        <div className={styles.column}>
          <Window>
            <StateList className={styles.panel} />
          </Window>
        </div>
        <div className={styles.column}>
          <Window>
            <TransitionList className={styles.panel} />
          </Window>
        </div>
      </section>
      <footer className={styles.footer}>
        <Window>
          <Timeline />
        </Window>
      </footer>
    </section>
    <aside className={styles.aside}>
      <Window>
        <Inspector />
      </Window>
    </aside>
  </div>
);
