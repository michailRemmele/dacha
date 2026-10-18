import { useState, useRef, useMemo, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { theme } from 'antd';
import type { BitmapFont } from 'pixi.js';
import { filterUnsupportedChars } from 'dacha/renderer';

import { NAMESPACE_EDITOR } from '../../../../../providers/schemas-provider/consts';
import { LabelledTextArea } from '../../../components/text-area';
import { PreviewFrame } from '../common/preview-frame';

import { useBitmapFont } from './use-bitmap-font';
import { usePixiText } from './use-pixi-text';
import { DEFAULT_SAMPLE_TEXT } from './consts';
import * as styles from './bitmap-font-preview.module.css';

interface BitmapFontPreviewProps {
  src?: string;
}

interface SampleCanvasProps {
  font?: BitmapFont;
  text: string;
}

const SampleCanvas: FC<SampleCanvasProps> = ({ font, text }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const { token } = theme.useToken();
  usePixiText(hostRef, font, text, token.colorText);

  return (
    <div className={styles.frame}>
      <div
        ref={hostRef}
        className={styles.canvas}
        data-testid="bitmap-font-canvas"
      />
    </div>
  );
};

/**
 * A sample string drawn with a bitmap font asset.
 */
export const BitmapFontPreview: FC<BitmapFontPreviewProps> = ({ src }) => {
  const { t } = useTranslation();
  const { status, font } = useBitmapFont(src);
  const [sample, setSample] = useState(DEFAULT_SAMPLE_TEXT);

  const filtered = useMemo(
    () => (font ? filterUnsupportedChars(sample, font) : sample),
    [font, sample],
  );

  return (
    <PreviewFrame status={status} testId="bitmap-font-preview">
      <LabelledTextArea
        label={t('inspector.assetPreview.bitmapFont.sample.label', {
          ns: NAMESPACE_EDITOR,
        })}
        value={sample}
        onChange={setSample}
        data-testid="bitmap-font-sample"
      />
      <SampleCanvas font={font} text={filtered} />
    </PreviewFrame>
  );
};
