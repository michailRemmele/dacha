import {
  useCallback,
  useEffect,
  useContext,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Tabs } from 'antd'

import { InspectedEntityContext } from '../../providers'
import { persistentStorage } from '../../../persistent-storage'
import { TabsCSS } from '../../common-styles/tabs.style'

import { ScenesExplorer, TemplatesExplorer } from './components'
import { ExplorerStyled } from './explorer.style'

export const Explorer = (): JSX.Element => {
  const { t } = useTranslation()
  const { type, path } = useContext(InspectedEntityContext)

  const [activeTab, setActiveTab] = useState(() => persistentStorage.get('explorer.activeTab', 'scene'))

  const handleChange = useCallback((activeKey: string) => {
    setActiveTab(activeKey)
    persistentStorage.set('explorer.activeTab', activeKey)
  }, [])

  useEffect(() => {
    if (type) {
      handleChange(type === 'actor' ? 'scene' : type)
    }
  }, [path])

  return (
    <ExplorerStyled>
      <Tabs css={TabsCSS} type="card" activeKey={activeTab} onChange={handleChange} destroyInactiveTabPane>
        <Tabs.TabPane tab={t('explorer.tab.scenes')} key="scene">
          <ScenesExplorer />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('explorer.tab.templates')} key="template">
          <TemplatesExplorer />
        </Tabs.TabPane>
      </Tabs>
    </ExplorerStyled>
  )
}
