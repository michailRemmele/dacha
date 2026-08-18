import {
  useCallback,
  useEffect,
  useContext,
  useState,
  ReactElement,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs } from 'antd';

import { InspectedEntityContext } from '../../providers';
import { persistentStorage } from '../../../persistent-storage';
import { TabsCSS } from '../../common-styles/tabs.style';

import {
  ScenesExplorer,
  TemplatesExplorer,
  AssetsExplorer,
} from './components';
import { ExplorerStyled } from './explorer.style';

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
    <ExplorerStyled>
      <Tabs
        css={TabsCSS}
        type="card"
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
    </ExplorerStyled>
  );
};
