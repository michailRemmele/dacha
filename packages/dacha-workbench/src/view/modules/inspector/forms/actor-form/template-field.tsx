import { useMemo, useCallback, useContext, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Button, Space } from 'antd';
import { ArrowRight } from '@gravity-ui/icons';
import { Icon } from '../../../../components';
import type { ActorConfig, TemplateConfig } from 'dacha';

import { findPathById } from '../../../../../utils/find-path-by-id';
import { Labelled } from '../../components';
import { useConfig, useStore } from '../../../../hooks';
import { EngineContext } from '../../../../providers';
import { EventType } from '../../../../../events';

import { parseTemplatePath } from './utils';
import styles from './actor-form.module.css';

interface TemplateFieldProps {
  path: string[];
}

export const TemplateField: FC<TemplateFieldProps> = ({ path }) => {
  const { t } = useTranslation();
  const store = useStore();

  const { world } = useContext(EngineContext);

  const templatePath = useMemo(() => {
    const actor = store.get(path) as ActorConfig;
    const templates = store.get(['templates']) as TemplateConfig[];

    return parseTemplatePath(
      findPathById(
        templates,
        actor.templateId as string,
        (template) => template.id,
      ),
    );
  }, [path, store]);

  const { name } = useConfig(templatePath) as TemplateConfig;

  const handleTemplateInspect = useCallback(() => {
    world.dispatchEvent(EventType.SelectEntities, { paths: [templatePath] });
    world.dispatchEvent(EventType.InspectEntity, { path: templatePath });
  }, [templatePath, world]);

  return (
    <Labelled label={t('inspector.actorForm.field.templateName.label')}>
      <Space.Compact className={styles.spaceCompact}>
        <Input value={name} disabled />
        <Button
          icon={<Icon icon={<ArrowRight />} />}
          onClick={handleTemplateInspect}
        />
      </Space.Compact>
    </Labelled>
  );
};
