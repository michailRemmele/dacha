import { useState, useCallback, FC } from 'react';
import { Checkbox, Typography } from 'antd';
import type { CheckboxChangeEvent } from 'antd/lib/checkbox';

import { modules } from '../../../../../engine/systems/debug-visualizer/modules';
import { persistentStorage } from '../../../../../persistent-storage';
import type { ModalComponentProps } from '../types';

import * as styles from './debug-layers.module.css';

const getStorageKey = (id: string): string =>
  `canvas.debugVisualizer.layers.${id}`;

export const DebugLayers: FC<ModalComponentProps> = () => {
  const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>(() =>
    modules.reduce(
      (acc, module) => {
        acc[module.id] = persistentStorage.get(getStorageKey(module.id), false);
        return acc;
      },
      {} as Record<string, boolean>,
    ),
  );

  const handleChange = useCallback(
    (id: string) =>
      (event: CheckboxChangeEvent): void => {
        const { checked } = event.target;

        setEnabledMap((prev) => ({ ...prev, [id]: checked }));
        window.electron.toggleDebugLayer(id, checked);
      },
    [],
  );

  return (
    <div className={styles.debugLayers}>
      {modules.map((module) => (
        <label key={module.id} className={styles.layerField}>
          <Typography.Text className={styles.layerLabel}>
            {module.title}
          </Typography.Text>
          <Checkbox
            checked={enabledMap[module.id]}
            onChange={handleChange(module.id)}
          />
        </label>
      ))}
    </div>
  );
};
