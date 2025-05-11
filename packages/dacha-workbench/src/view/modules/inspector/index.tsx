import {
  useCallback,
  useEffect,
  useContext,
  useState,
  useRef,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Tabs } from 'antd'

import { persistentStorage } from '../../../persistent-storage'
import { SchemasProvider, InspectedEntityContext } from '../../providers'
import { TabsCSS } from '../../common-styles/tabs.style'

import { EntityInspector, ProjectSettings, Systems } from './tabs'
import {
  InspectorStyled,
  TabContentStyled,
} from './inspector.style'

export const Inspector = (): JSX.Element => {
  const { t } = useTranslation()
  const { path } = useContext(InspectedEntityContext)

  const initialRenderRef = useRef(true)

  const [activeTab, setActiveTab] = useState(() => persistentStorage.get('inspector.activeTab', 'entityInspector'))

  const handleChange = useCallback((activeKey: string) => {
    setActiveTab(activeKey)
    persistentStorage.set('inspector.activeTab', activeKey)
  }, [])

  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false
      return
    }

    if (path) {
      handleChange('entityInspector')
    }
  }, [path])

  return (
    <SchemasProvider>
      <InspectorStyled>
        <Tabs css={TabsCSS} type="card" activeKey={activeTab} onChange={handleChange}>
          <Tabs.TabPane tab={t('inspector.tab.entityInspector')} key="entityInspector">
            <TabContentStyled>
              <EntityInspector />
            </TabContentStyled>
          </Tabs.TabPane>
          <Tabs.TabPane tab={t('inspector.tab.systems')} key="systems">
            <TabContentStyled>
              <Systems />
            </TabContentStyled>
          </Tabs.TabPane>
          <Tabs.TabPane tab={t('inspector.tab.projectSettings')} key="projectSettings">
            <TabContentStyled>
              <ProjectSettings />
            </TabContentStyled>
          </Tabs.TabPane>
        </Tabs>
      </InspectorStyled>
    </SchemasProvider>
  )
}
