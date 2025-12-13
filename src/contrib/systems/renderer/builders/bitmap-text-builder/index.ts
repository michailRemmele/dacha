import { BitmapText as PixiBitmapText } from 'pixi.js';

import type { Builder } from '../builder';
import type { Assets } from '../../assets';
import { BLEND_MODE_MAPPING } from '../../consts';
import { BitmapText } from '../../../../components/bitmap-text';
import type { Actor } from '../../../../../engine/actor';

import { filterUnsupportedChars } from './utils';

interface BitmapTextBuilderOptions {
  assets: Assets;
}

export class BitmapTextBuilder implements Builder<BitmapText> {
  private assets: Assets;

  constructor({ assets }: BitmapTextBuilderOptions) {
    this.assets = assets;
  }

  destroy(text: BitmapText): void {
    text.renderData?.view.destroy();
    text.renderData = undefined;
  }

  buildView(text: BitmapText, actor: Actor): PixiBitmapText {
    const view = new PixiBitmapText({
      anchor: 0.5,
      style: {
        fontFamily: 'sans-serif',
      },
    });

    text.renderData = { view };
    view.__dacha = {
      actor,
      builderKey: BitmapText.componentName,
      viewComponent: text,
      meta: {},
    };

    return view;
  }

  updateView(text: BitmapText): void {
    const view = text.renderData!.view;
    const meta = view.__dacha.meta;

    if (text.disabled !== meta.disabled) {
      view.visible = !text.disabled;
      meta.disabled = text.disabled;
    }

    if (text.blending !== meta.blending) {
      view.blendMode = BLEND_MODE_MAPPING[text.blending];
      meta.blending = text.blending;
    }

    if (text.opacity !== meta.opacity) {
      view.alpha = text.opacity;
      meta.opacity = text.opacity;
    }

    const font = this.assets.get(text);
    if (font && font.fontFamily !== meta.fontFamily) {
      view.style.fontFamily = font.fontFamily;
      meta.fontFamily = font.fontFamily;
    }

    if (text.text !== meta.text) {
      const filteredText = font
        ? filterUnsupportedChars(text.text, font)
        : text.text;

      if (filteredText.length !== text.text.length) {
        console.warn(
          `Font contains unsupported characters: "${text.text}". Displaying filtered text instead.`,
        );
      }

      view.text = filteredText;

      meta.text = text.text;
    }

    if (text.fontSize !== meta.fontSize) {
      view.style.fontSize = text.fontSize;
      meta.fontSize = text.fontSize;
    }

    if (text.align !== meta.align) {
      view.style.align = text.align;
      meta.align = text.align;
    }

    if (text.color !== meta.color) {
      view.style.fill = text.color;
      meta.color = text.color;
    }
  }
}
