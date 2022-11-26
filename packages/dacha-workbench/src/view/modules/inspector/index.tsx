import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { Tabs } from 'antd'

import { SchemasProvider } from '../../providers'
import { useExtension } from '../../hooks'
import { NAMESPACE_EXTENSION } from '../../providers/schemas-provider/consts'

import { EntityInspector, ProjectSettings } from './tabs'

import './style.less'

export const Inspector = (): JSX.Element => {
  const { t } = useTranslation()

  const { locales: extLocales } = useExtension()

  useMemo(() => Object.keys(extLocales).forEach((lng) => {
    i18next.addResourceBundle(lng, NAMESPACE_EXTENSION, extLocales[lng])
  }), [extLocales])

  return (
    <SchemasProvider>
      <div className="inspector">
        <Tabs type="card">
          <Tabs.TabPane tab={t('inspector.tab.entityInspector')} key="entityInspector">
            <div className="inspector__tab-content">
              <EntityInspector />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab={t('inspector.tab.projectSettings')} key="projectSettings">
            <div className="inspector__tab-content">
              <ProjectSettings />
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </SchemasProvider>
  )
}
