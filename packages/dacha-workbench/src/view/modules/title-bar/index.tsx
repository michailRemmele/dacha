import { useMemo, FC } from 'react';

import { WindowControls, AppMenu, ProjectTitle } from './components';
import styles from './title-bar.module.css';

interface TitleBarProps {
  unsavedChanges: boolean;
}

export const TitleBar: FC<TitleBarProps> = ({ unsavedChanges }) => {
  const isMac = useMemo(() => window.electron.getPlatform() === 'darwin', []);
  const projectName = useMemo(
    () => window.electron.getEditorConfig().projectName,
    [],
  );

  return (
    <div className={styles.titleBar}>
      <div className={styles.left}>{!isMac && <AppMenu />}</div>
      <div className={styles.center}>
        <ProjectTitle
          projectName={projectName}
          unsavedChanges={unsavedChanges}
        />
      </div>
      <div className={styles.right}>{!isMac && <WindowControls />}</div>
    </div>
  );
};
