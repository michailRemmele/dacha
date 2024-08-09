import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Tabs } from 'antd'

import { persistentStorage } from '../../../persistent-storage'
import { TabsCSS } from '../../common-styles/tabs.style'

import { LevelsTree, TemplatesTree, ScenesList } from './components'
import { ExplorerStyled } from './explorer.style'

export const Explorer = (): JSX.Element => {
  const { t } = useTranslation()

  const initialActiveTab = useMemo(() => persistentStorage.get('explorer.activeTab', 'levels'), [])

  const handleChange = useCallback((activeKey: string) => {
    persistentStorage.set('explorer.activeTab', activeKey)
  }, [])

  return (
    <ExplorerStyled>
      <Tabs css={TabsCSS} type="card" defaultActiveKey={initialActiveTab} onChange={handleChange}>
        <Tabs.TabPane tab={t('explorer.tab.levels')} key="levels">
          <LevelsTree />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('explorer.tab.templates')} key="templates">
          <TemplatesTree />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('explorer.tab.scenes')} key="scenes">
          <ScenesList />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('explorer.tab.loaders')} key="loaders">
          <ScenesList isLoaders />
        </Tabs.TabPane>
      </Tabs>
    </ExplorerStyled>
  )
}
