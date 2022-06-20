import React from 'react'
import { useTranslation } from 'react-i18next'
import { Tabs } from 'antd'

import { LevelsTree } from './components'

import './style.less'

export const Explorer = (): JSX.Element => {
  const { t } = useTranslation()

  return (
    <div className="explorer">
      <Tabs type="card">
        <Tabs.TabPane tab={t('explorer.tab.levels')} key="levels">
          <LevelsTree />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('explorer.tab.templates')} key="templates">
          Hello Templates
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('explorer.tab.scenes')} key="scenes">
          Hello Scenes
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}
