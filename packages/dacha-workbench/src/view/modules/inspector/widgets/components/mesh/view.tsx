import { useMemo, useCallback, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';

import type { WidgetProps } from '../../../../../../types/widget-schema';
import { Widget } from '../../../components/widget';
import { Panel } from '../../../components/panel';
import { Labelled } from '../../../components/labelled';
import { BehaviorWidget } from '../../../components/behavior-widget';
import { EntitySelect } from '../../../components/entity-picker';
import { useConfig, useCommander, useBehaviors } from '../../../../../hooks';
import { setValue, deleteValue } from '../../../../../commands';

import { MeshStyled, ShaderFormStyled, PanelCSS } from './mesh.style';

const BEHAVIOR_TYPE = 'shader';

interface MaterialConfig {
  name: string;
  options: Record<string, unknown>;
}

export const MeshWidget: FC<WidgetProps> = ({ path, fields }) => {
  const { t } = useTranslation();
  const { dispatch } = useCommander();

  const shaders = useBehaviors(BEHAVIOR_TYPE);

  const materialPath = useMemo(() => path.concat('material'), [path]);
  const optionsPath = useMemo(
    () => materialPath.concat('options'),
    [materialPath],
  );

  const material = useConfig(materialPath) as MaterialConfig | undefined;
  const shaderSchema = material?.name ? shaders?.[material.name] : undefined;

  const availableShaders = useMemo(() => {
    return Object.keys(shaders ?? {}).map((key) => ({
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
          options: shaders?.[name].getInitialState?.() ?? {},
        }),
      );
      setEntityValue(name);
    },
    [dispatch, materialPath, shaders],
  );

  const handleCreate = useCallback((name: string, filepath: string) => {
    window.electron.createBehavior(name, filepath, BEHAVIOR_TYPE);
  }, []);

  return (
    <MeshStyled>
      {fields?.length ? <Widget fields={fields} path={path} /> : null}

      <Panel
        css={PanelCSS(material?.name !== undefined && !shaderSchema)}
        size="small"
        title={t('components.mesh.material.panel.title')}
      >
        <Labelled label={t('components.mesh.material.title')}>
          <EntitySelect
            options={availableShaders}
            type={BEHAVIOR_TYPE}
            onAdd={handleAddShader}
            onCreate={handleCreate}
            value={entityValue}
          />
        </Labelled>

        {material ? (
          <>
            {!shaderSchema ? (
              <ShaderFormStyled>
                {t('components.mesh.material.noSchema.title')}
              </ShaderFormStyled>
            ) : shaderSchema.fields?.length || shaderSchema.view ? (
              <BehaviorWidget
                name={material.name}
                path={optionsPath}
                systemName={BEHAVIOR_TYPE}
              />
            ) : null}
          </>
        ) : null}
      </Panel>
    </MeshStyled>
  );
};
