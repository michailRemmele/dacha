import { useState, useEffect, useCallback, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Minus, Square, Copy, Xmark } from '@gravity-ui/icons';
import { Icon } from '../../../../components';

import { cx } from '../../../../../utils/cx';

import * as styles from './window-controls.module.css';

export const WindowControls: FC = () => {
  const { t } = useTranslation();

  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => window.electron.onWindowStateChanged(setIsMaximized), []);

  const handleMinimize = useCallback(
    () => window.electron.minimizeWindow(),
    [],
  );
  const handleMaximizeToggle = useCallback(
    () => window.electron.toggleMaximizeWindow(),
    [],
  );
  const handleClose = useCallback(() => window.electron.closeWindow(), []);

  return (
    <div className={styles.windowControls}>
      <button
        type="button"
        className={styles.control}
        title={t('titleBar.windowControls.minimize.title')}
        onClick={handleMinimize}
      >
        <Icon icon={<Minus />} />
      </button>
      <button
        type="button"
        className={styles.control}
        title={t(
          isMaximized
            ? 'titleBar.windowControls.restore.title'
            : 'titleBar.windowControls.maximize.title',
        )}
        onClick={handleMaximizeToggle}
      >
        <Icon icon={isMaximized ? <Copy /> : <Square />} />
      </button>
      <button
        type="button"
        className={cx(styles.control, styles.close)}
        title={t('titleBar.windowControls.close.title')}
        onClick={handleClose}
      >
        <Icon icon={<Xmark />} />
      </button>
    </div>
  );
};
