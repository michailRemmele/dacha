import { useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { Tabs } from 'antd'

import { persistentStorage } from '../../../persistent-storage'
import { SchemasProvider } from '../../providers'
import { useExtension } from '../../hooks'
import { NAMESPACE_EXTENSION } from '../../providers/schemas-provider/consts'
import { TabsCSS } from '../../common-styles/tabs.style'

import { EntityInspector, ProjectSettings } from './tabs'
import {
  InspectorStyled,
  TabContentStyled,
} from './inspector.style'

export const Inspector = (): JSX.Element => {
  const { t } = useTranslation()

  const { locales: extLocales } = useExtension()

  useMemo(() => Object.keys(extLocales).forEach((lng) => {
    i18next.addResourceBundle(lng, NAMESPACE_EXTENSION, extLocales[lng])
  }), [extLocales])

  const initialActiveTab = useMemo(() => persistentStorage.get('inspector.activeTab', 'entityInspector'), [])

  const handleChange = useCallback((activeKey: string) => {
    persistentStorage.set('inspector.activeTab', activeKey)
  }, [])

  return (
    <SchemasProvider>
      <InspectorStyled>
        <Tabs css={TabsCSS} type="card" defaultActiveKey={initialActiveTab} onChange={handleChange}>
          <Tabs.TabPane tab={t('inspector.tab.entityInspector')} key="entityInspector">
            <TabContentStyled>
              <EntityInspector />
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
