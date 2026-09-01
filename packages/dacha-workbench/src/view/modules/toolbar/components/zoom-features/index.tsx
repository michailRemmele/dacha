import { useState, useCallback, useContext, useEffect, FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { RadioChangeEvent } from 'antd';
import { Radio } from 'antd';
import { MagnifierPlus, MagnifierMinus } from '@gravity-ui/icons';
import { Icon } from '../../../../components';

import styles from '../../toolbar.module.css';
import { EngineContext } from '../../../../providers';
import type { FeatureValue } from '../../../../../engine/components/tool';
import type { ToolFeaturesProps } from '../types';
import { EventType } from '../../../../../events';

export const ZoomFeatures: FC<ToolFeaturesProps> = ({ features }) => {
  const { t } = useTranslation();
  const { world } = useContext(EngineContext);

  const [values, setValues] = useState<Record<string, FeatureValue>>({
    direction: '',
  });

  useEffect(() => {
    Object.keys(features).forEach((name) => {
      if (values[name] !== features[name]) {
        setValues({
          ...values,
          [name]: features[name],
        });
      }
    });
  }, [features]);

  const handleSelect = useCallback(
    (event: RadioChangeEvent) => {
      world.dispatchEvent(EventType.SetToolFeatureValue, {
        name: event.target.name as string,
        value: event.target.value as string,
      });
    },
    [world],
  );

  return (
    <div className={styles.toolFeatures}>
      <Radio.Group
        name="direction"
        buttonStyle="solid"
        value={values.direction}
        onChange={handleSelect}
      >
        <Radio.Button value="in">
          <Icon
            data-testid="zoom-direction-in"
            title={t('toolbar.zoom.features.direction.in.title')}
            icon={<MagnifierPlus />}
          />
        </Radio.Button>
        <Radio.Button value="out">
          <Icon
            data-testid="zoom-direction-out"
            title={t('toolbar.zoom.features.direction.out.title')}
            icon={<MagnifierMinus />}
          />
        </Radio.Button>
      </Radio.Group>
    </div>
  );
};
