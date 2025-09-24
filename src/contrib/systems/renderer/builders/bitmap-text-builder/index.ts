import { BitmapText as PixiBitmapText, Bounds, Assets, type BitmapFont } from 'pixi.js';

import type { Builder } from '../builder';
import { BLEND_MODE_MAPPING } from '../../consts';
import { Transform } from '../../../../components/transform';
import { BitmapText } from '../../../../components/bitmap-text';
import type { Actor } from '../../../../../engine/actor';
import { floatEquals } from '../utils';

import { filterUnsupportedChars } from './utils';

export class BitmapTextBuilder implements Builder {
  destroy(actor: Actor): void {
    const text = actor.getComponent(BitmapText);

    text.renderData?.view.destroy();
    text.renderData = undefined;
  }

  buildView(actor: Actor): PixiBitmapText | undefined {
    const text = actor.getComponent(BitmapText);
    if (!text) {
      return undefined;
    }

    const { offsetX, offsetY } = actor.getComponent(Transform);

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
      bounds: new Bounds(offsetX, offsetY, offsetX, offsetY),
      meta: {},
      didChange: false,
    };

    return view;
  }

  updateView(actor: Actor): void {
    const transform = actor.getComponent(Transform);
    const text = actor.getComponent(BitmapText);

    if (!text) {
      return undefined;
    }

    const view = text.renderData!.view;
    const meta = view.__dacha.meta;

    view.__dacha.didChange = false;

    if (text.disabled !== meta.disabled) {
      view.visible = !text.disabled;
      meta.disabled = text.disabled;
      view.__dacha.didChange = true;
    }

    if (text.blending !== meta.blending) {
      view.blendMode = BLEND_MODE_MAPPING[text.blending];
      meta.blending = text.blending;
      view.__dacha.didChange = true;
    }

    if (text.opacity !== meta.opacity) {
      view.alpha = text.opacity;
      meta.opacity = text.opacity;
      view.__dacha.didChange = true;
    }

    // @ts-expect-error, comment: In order to avoid warning spam if value is missing
    const font = Assets.cache._cache.get(text.font) as BitmapFont | undefined;
    if (font && font.fontFamily !== meta.fontFamily) {
      view.style.fontFamily = font.fontFamily;
      meta.fontFamily = font.fontFamily;
      view.__dacha.didChange = true;
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
      view.__dacha.didChange = true;
    }

    if (text.fontSize !== meta.fontSize) {
      view.style.fontSize = text.fontSize;
      meta.fontSize = text.fontSize;
      view.__dacha.didChange = true;
    }

    if (text.align !== meta.align) {
      view.style.align = text.align;
      meta.align = text.align;
      view.__dacha.didChange = true;
    }

    if (text.color !== meta.color) {
      view.style.fill = text.color;
      meta.color = text.color;
      view.__dacha.didChange = true;
    }

    const angle = transform.rotation;
    if (angle !== meta.angle) {
      view.angle = angle;
      meta.angle = angle;
      view.__dacha.didChange = true;
    }

    const { offsetX, offsetY } = transform;
    if (
      !floatEquals(offsetX, meta.offsetX as number) ||
      !floatEquals(offsetY, meta.offsetY as number)
    ) {
      view.position.set(offsetX, offsetY);
      meta.offsetX = offsetX;
      meta.offsetY = offsetY;
      view.__dacha.didChange = true;
    }

    const { scaleX, scaleY } = transform;
    if (scaleX !== meta.scaleX || scaleY !== meta.scaleY) {
      view.scale.set(scaleX, scaleY);
      meta.scaleX = scaleX;
      meta.scaleY = scaleY;
      view.__dacha.didChange = true;
    }
  }
}
