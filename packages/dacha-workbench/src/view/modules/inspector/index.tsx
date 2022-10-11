import React from 'react'
import { useTranslation } from 'react-i18next'
import { Tabs } from 'antd'

import { EntityInspector, ProjectSettings } from './tabs'

import './style.less'

export const Inspector = (): JSX.Element => {
  const { t } = useTranslation()

  return (
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
  )
}
