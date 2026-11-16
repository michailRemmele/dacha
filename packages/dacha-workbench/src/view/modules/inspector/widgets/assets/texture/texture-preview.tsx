import { useState, useCallback, FC, SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { TextureData } from 'dacha';

import { NAMESPACE_EDITOR } from '../../../../../providers/schemas-provider/consts';
import { PreviewFrame, type PreviewStatus } from '../common/preview-frame';

import { getImageRendering } from './utils';
import * as styles from './texture-preview.module.css';

interface TexturePreviewProps {
  data?: TextureData;
}

interface Size {
  width: number;
  height: number;
}

interface PreviewProps {
  src: string;
  filter: TextureData['filter'];
}

const Preview: FC<PreviewProps> = ({ src, filter }) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<PreviewStatus>('loading');
  const [size, setSize] = useState<Size>();

  const handleLoad = useCallback((event: SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    setSize({ width: naturalWidth, height: naturalHeight });
    setStatus('ready');
  }, []);
  const handleError = useCallback(() => setStatus('error'), []);

  return (
    <PreviewFrame
      className={styles.texturePreview}
      status={status}
      testId="texture-preview"
    >
      <img
        className={styles.image}
        src={src}
        style={{ imageRendering: getImageRendering(filter) }}
        onLoad={handleLoad}
        onError={handleError}
        data-testid="texture-preview-image"
      />
      {size ? (
        <div className={styles.size} data-testid="texture-preview-size">
          {t('inspector.assetPreview.texture.size.title', {
            ns: NAMESPACE_EDITOR,
            width: size.width,
            height: size.height,
          })}
        </div>
      ) : null}
    </PreviewFrame>
  );
};

/** The image of a texture asset with its size. */
export const TexturePreview: FC<TexturePreviewProps> = ({ data }) => {
  if (!data?.src) {
    return null;
  }

  return <Preview key={data.src} src={data.src} filter={data.filter} />;
};
