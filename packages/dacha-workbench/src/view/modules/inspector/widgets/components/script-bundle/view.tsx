import {
  useMemo,
  useCallback,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import { v4 as uuidv4 } from 'uuid'
import { ScriptSystem } from 'dacha'

import type { WidgetProps } from '../../../../../../types/widget-schema'
import { useConfig, useCommander, useExtension } from '../../../../../hooks'
import { addValue } from '../../../../../commands'

import { ScriptListStyled, ButtonCSS } from './script-bundle.style'
import { ScriptPanel } from './script-panel'
import type { Script } from './types'

export const ScriptBundleWidget: FC<WidgetProps> = ({ path }) => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const { resourcesSchema } = useExtension()

  const scriptsPath = useMemo(() => path.concat('scripts'), [path])

  const selectedScripts = useConfig(scriptsPath) as Array<Script>

  const availableScripts = useMemo(() => {
    const scriptNames = Object.keys(resourcesSchema[ScriptSystem.systemName] || {})
    return scriptNames.map((key) => ({
      title: key,
      value: key,
    }))
  }, [])

  const handleAddScript = useCallback(() => {
    dispatch(addValue(scriptsPath, {
      id: uuidv4(),
      name: '',
      options: {},
    }))
  }, [dispatch, scriptsPath])

  return (
    <div>
      <ScriptListStyled>
        {selectedScripts.map(({ id }, index) => (
          <li key={id}>
            <ScriptPanel
              id={id}
              path={scriptsPath}
              order={index}
              availableScripts={availableScripts}
            />
          </li>
        ))}
      </ScriptListStyled>
      <Button
        css={ButtonCSS}
        size="small"
        onClick={handleAddScript}
        disabled={availableScripts.length === 0}
      >
        {t('components.scriptBundle.script.addNew.title')}
      </Button>
    </div>
  )
}
