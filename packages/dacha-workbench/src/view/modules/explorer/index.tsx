import {
  useCallback,
  useEffect,
  useContext,
  useState,
  ReactElement,
} from 'react';
import { useTranslation } from 'react-i18next';

import { InspectedEntityContext } from '../../providers';
import { persistentStorage } from '../../../persistent-storage';
import { PanelTabs } from '../../components';

import {
  ScenesExplorer,
  TemplatesExplorer,
  AssetsExplorer,
} from './components';
import * as styles from './explorer.module.css';

export const Explorer = (): ReactElement => {
  const { t } = useTranslation();
  const { type, path } = useContext(InspectedEntityContext);

  const [activeTab, setActiveTab] = useState(() =>
    persistentStorage.get('explorer.activeTab', 'scene'),
  );

  const handleChange = useCallback((activeKey: string) => {
    setActiveTab(activeKey);
    persistentStorage.set('explorer.activeTab', activeKey);
  }, []);

  useEffect(() => {
    if (type) {
      handleChange(type === 'actor' ? 'scene' : type);
    }
  }, [path]);

  return (
    <div className={styles.explorer}>
      <PanelTabs
        activeKey={activeTab}
        onChange={handleChange}
        destroyOnHidden
        items={[
          {
            key: 'scene',
            label: t('explorer.tab.scenes'),
            children: <ScenesExplorer />,
          },
          {
            key: 'template',
            label: t('explorer.tab.templates'),
            children: <TemplatesExplorer />,
          },
          {
            key: 'asset',
            label: t('explorer.tab.assets'),
            children: <AssetsExplorer />,
          },
        ]}
      />
    </div>
  );
};
