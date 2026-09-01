import type { ReactElement } from 'react';
import * as React from 'react';

import * as styles from './window.module.css';

interface WindowProps {
  children: React.ReactNode;
}

export const Window = ({ children }: WindowProps): ReactElement => (
  <div className={styles.window}>{children}</div>
);
