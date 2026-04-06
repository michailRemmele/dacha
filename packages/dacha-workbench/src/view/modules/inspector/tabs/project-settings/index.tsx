import { useMemo, FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { SceneConfig } from 'dacha';

import { useConfig } from '../../../../hooks';
import { Field, LabelledSelect, Form } from '../../components';
import {
  SortingWidget,
  AudioGroupsWidget,
  PerformanceWidget,
  PhysicsWidget,
} from '../../widgets/global-options';

export const ProjectSettings: FC = () => {
  const { t } = useTranslation();

  const scenes = useConfig('scenes') as SceneConfig[];

  const sceneOptions = useMemo(
    () =>
      scenes.map((scene) => ({
        title: scene.name,
        value: scene.id,
      })),
    [scenes],
  );

  return (
    <Form>
      <Field
        path={['startSceneId']}
        component={LabelledSelect}
        label={t('inspector.projectSettings.field.startScene.label')}
        options={sceneOptions}
        allowEmpty
      />
      <div>{t('inspector.projectSettings.globalOptions.title')}</div>

      <PerformanceWidget />
      <SortingWidget />
      <AudioGroupsWidget />
      <PhysicsWidget />
    </Form>
  );
};
