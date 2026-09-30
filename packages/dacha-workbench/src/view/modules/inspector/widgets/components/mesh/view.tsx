import { useMemo, useCallback, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { SchemaKind } from 'dacha';

import type { WidgetProps } from '../../../../../../types/widget-schema';
import { Widget } from '../../../components/widget';
import { Section } from '../../../components/section';
import { Labelled } from '../../../components/labelled';
import { BehaviorWidget } from '../../../components/behavior-widget';
import { EntitySelect } from '../../../components/entity-picker';
import { useConfig, useCommander, useSchemas } from '../../../../../hooks';
import { setValue, deleteValue } from '../../../../../commands';
import { buildInitialState } from '../../../../../../schema';

import { cx } from '../../../../../../utils/cx';

import * as styles from './mesh.module.css';

const SHADER_KIND = 'shader' satisfies SchemaKind;

interface MaterialConfig {
  name: string;
  options: Record<string, unknown>;
}

export const MeshWidget: FC<WidgetProps> = ({ path, ...props }) => {
  const { t } = useTranslation();
  const { dispatch } = useCommander();

  const shaders = useSchemas(SHADER_KIND);

  const materialPath = useMemo(() => path.concat('material'), [path]);
  const optionsPath = useMemo(
    () => materialPath.concat('options'),
    [materialPath],
  );

  const material = useConfig(materialPath) as MaterialConfig | undefined;
  const shaderSchema = material?.name ? shaders[material.name] : undefined;

  const availableShaders = useMemo(() => {
    return Object.keys(shaders).map((key) => ({
      label: key,
      value: key,
    }));
  }, [shaders]);

  const [entityValue, setEntityValue] = useState(material?.name ?? null);

  const handleAddShader = useCallback(
    (name: string | null) => {
      if (name === null) {
        dispatch(deleteValue(materialPath));
        setEntityValue(null);
        return;
      }

      dispatch(
        setValue(materialPath, {
          name,
          options: buildInitialState(shaders[name].fields ?? []),
        }),
      );
      setEntityValue(name);
    },
    [dispatch, materialPath, shaders],
  );

  const handleCreate = useCallback((name: string, filepath: string) => {
    window.electron.createBehavior(name, filepath, SHADER_KIND);
  }, []);

  return (
    <div>
      <Widget {...props} path={path} />

      <Section
        className={cx(
          material?.name !== undefined && !shaderSchema && styles.panelNoSchema,
        )}
        title={t('components.mesh.material.panel.title')}
      >
        <Labelled label={t('components.mesh.material.title')}>
          <EntitySelect
            options={availableShaders}
            type={SHADER_KIND}
            onAdd={handleAddShader}
            onCreate={handleCreate}
            value={entityValue}
          />
        </Labelled>

        {material ? (
          <>
            {!shaderSchema ? (
              <div className={styles.shaderForm}>
                {t('components.mesh.material.noSchema.title')}
              </div>
            ) : shaderSchema.fields?.length || shaderSchema.view ? (
              <BehaviorWidget
                name={material.name}
                path={optionsPath}
                kind={SHADER_KIND}
              />
            ) : null}
          </>
        ) : null}
      </Section>
    </div>
  );
};
