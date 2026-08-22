import {
  useCallback,
  useEffect,
  useContext,
  useState,
  useRef,
  ReactElement,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs } from 'antd';

import { persistentStorage } from '../../../persistent-storage';
import { InspectedEntityContext } from '../../providers';
import { tabsClassNames } from '../../common-styles/tabs';

import { EntityInspector, ProjectSettings, Systems } from './tabs';
import styles from './inspector.module.css';

export const Inspector = (): ReactElement => {
  const { t } = useTranslation();
  const { path } = useContext(InspectedEntityContext);

  const initialRenderRef = useRef(true);

  const [activeTab, setActiveTab] = useState(() =>
    persistentStorage.get('inspector.activeTab', 'entityInspector'),
  );

  const handleChange = useCallback((activeKey: string) => {
    setActiveTab(activeKey);
    persistentStorage.set('inspector.activeTab', activeKey);
  }, []);

  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }

    if (path) {
      handleChange('entityInspector');
    }
  }, [path]);

  return (
    <div className={styles.inspector}>
      <Tabs
        classNames={{
          ...tabsClassNames,
          content: styles.tabContent,
        }}
        type="card"
        activeKey={activeTab}
        onChange={handleChange}
        items={[
          {
            key: 'entityInspector',
            label: t('inspector.tab.entityInspector'),
            children: <EntityInspector />,
          },
          {
            key: 'systems',
            label: t('inspector.tab.systems'),
            children: <Systems />,
          },
          {
            key: 'projectSettings',
            label: t('inspector.tab.projectSettings'),
            children: <ProjectSettings />,
          },
        ]}
      />
    </div>
  );
};
