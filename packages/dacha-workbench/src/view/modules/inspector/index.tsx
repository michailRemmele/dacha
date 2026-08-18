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
import { TabsCSS } from '../../common-styles/tabs.style';

import { EntityInspector, ProjectSettings, Systems } from './tabs';
import { InspectorStyled } from './inspector.style';

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
    <InspectorStyled>
      <Tabs
        css={TabsCSS}
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
    </InspectorStyled>
  );
};
