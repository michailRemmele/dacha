import type { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { NAMESPACE_EDITOR } from '../../../../../providers/schemas-provider/consts';
import { cx } from '../../../../../../utils/cx';

import * as styles from './preview-frame.module.css';

export type PreviewStatus = 'empty' | 'loading' | 'ready' | 'error';

interface PreviewFrameProps {
  status: PreviewStatus;
  testId: string;
  children?: ReactNode;
  className?: string;
}

export const PreviewFrame: FC<PreviewFrameProps> = ({
  status,
  testId,
  children,
  className,
}) => {
  const { t } = useTranslation();

  if (status === 'empty') {
    return null;
  }

  if (status === 'error') {
    return (
      <div
        className={cx(styles.error, className)}
        data-testid="asset-preview-error"
      >
        {t('inspector.assetPreview.error.title', { ns: NAMESPACE_EDITOR })}
      </div>
    );
  }

  return (
    <div className={cx(styles.previewFrame, className)} data-testid={testId}>
      {children}
    </div>
  );
};
