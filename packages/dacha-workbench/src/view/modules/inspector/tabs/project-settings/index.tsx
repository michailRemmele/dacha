import { useMemo, FC } from 'react';
import { useTranslation, I18nextProvider } from 'react-i18next';
import type { SceneConfig } from 'dacha';

import { useConfig } from '../../../../hooks';
import { InputField, LabelledSelect, Form } from '../../components';
import { Widget } from '../../components/widget';
import { CustomWidget } from '../../components/custom-widget';
import { CollapsePanel } from '../../components/collapse-panel';
import { globalOptionsSchema } from '../../widgets';
import { NAMESPACE_EDITOR } from '../../../../providers/schemas-provider/consts';
import { formatWidgetName } from '../../../../../utils/format-widget-name';

export const ProjectSettings: FC = () => {
  const { t, i18n } = useTranslation();

  const scenes = useConfig('scenes') as SceneConfig[];

  const sceneOptions = useMemo(
    () =>
      scenes.map((scene) => ({
        title: scene.name,
        value: scene.id,
      })),
    [scenes],
  );

  const widgets = useMemo(
    () =>
      Object.entries(globalOptionsSchema).sort(([aKey], [bKey]) => {
        return aKey.localeCompare(bKey);
      }),
    [],
  );

  return (
    <Form>
      <InputField
        path={['startSceneId']}
        component={LabelledSelect}
        label={t('inspector.projectSettings.field.startScene.label')}
        options={sceneOptions}
        allowEmpty
      />
      <div>{t('inspector.projectSettings.globalOptions.title')}</div>

      <>
        {widgets.map(([key, schema]) => {
          const path = ['globalOptions', `name:${key}`, 'options'];

          return (
            <CollapsePanel
              key={key}
              title={formatWidgetName(key)}
              deletable={false}
            >
              {schema.view ? (
                <CustomWidget
                  fields={schema.fields || []}
                  path={path}
                  component={schema.view}
                  namespace={NAMESPACE_EDITOR}
                />
              ) : (
                <I18nextProvider i18n={i18n} defaultNS={NAMESPACE_EDITOR}>
                  <Widget fields={schema.fields} path={path} />
                </I18nextProvider>
              )}
            </CollapsePanel>
          );
        })}
      </>
    </Form>
  );
};
