import { useMemo, useCallback, type FC, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import type { WidgetSchema } from '../../../../../../types/widget-schema';
import { Panel } from '../../../components/panel';
import { BehaviorWidget } from '../../../components/behavior-widget';
import { useConfig, useCommander } from '../../../../../hooks';
import { deleteValue } from '../../../../../commands';
import { formatWidgetName } from '../../../../../../utils/format-widget-name';
import { NAMESPACE_EXTENSION } from '../../../../../providers/schemas-provider/consts';

import { BEHAVIOR_TYPE } from './consts';
import { PanelCSS, EffectFormStyled } from './renderer.style';

export interface EffectPanelProps {
  id: string;
  path: string[];
  schema?: WidgetSchema;
  extra?: ReactNode;
}

export const EffectPanel: FC<EffectPanelProps> = ({
  id,
  path,
  schema,
  extra,
}) => {
  const { t } = useTranslation();

  const { dispatch } = useCommander();

  const effectPath = useMemo(() => path.concat(`id:${id}`), [path]);
  const namePath = useMemo(() => effectPath.concat('name'), [effectPath]);
  const optionsPath = useMemo(() => effectPath.concat('options'), [effectPath]);

  const name = useConfig(namePath) as string;

  const handleDelete = useCallback(() => {
    dispatch(deleteValue(effectPath));
  }, [dispatch, effectPath]);

  return (
    <Panel
      css={PanelCSS(!schema)}
      size="small"
      title={
        schema?.title
          ? t(schema.title, { ns: NAMESPACE_EXTENSION })
          : formatWidgetName(name)
      }
      onDelete={handleDelete}
      extra={extra}
    >
      {!schema ? (
        <EffectFormStyled>
          {t('systems.renderer.postEffect.noSchema.title')}
        </EffectFormStyled>
      ) : schema.fields?.length || schema.view ? (
        <BehaviorWidget
          name={name}
          path={optionsPath}
          systemName={BEHAVIOR_TYPE}
        />
      ) : null}
    </Panel>
  );
};
