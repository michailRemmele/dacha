import { useState, useEffect } from 'react';
import { Assets, BitmapFont } from 'pixi.js';

import type { PreviewStatus } from '../common/preview-frame';

interface LoadedFont {
  status: PreviewStatus;
  font?: BitmapFont;
}

export const useBitmapFont = (src?: string): LoadedFont => {
  const [state, setState] = useState<LoadedFont>({ status: 'empty' });

  useEffect(() => {
    if (!src) {
      setState({ status: 'empty' });
      return undefined;
    }

    let isCurrent = true;
    setState({ status: 'loading' });

    Assets.load(src).then(
      (font: unknown) => {
        if (isCurrent) {
          setState(
            font instanceof BitmapFont
              ? { status: 'ready', font }
              : { status: 'error' },
          );
        }
      },
      () => {
        if (isCurrent) {
          setState({ status: 'error' });
        }
      },
    );

    return (): void => {
      isCurrent = false;
    };
  }, [src]);

  return src ? state : { status: 'empty' };
};
