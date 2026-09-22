import type { BitmapText as PixiBitmapText } from 'pixi.js';

import { Component } from '../../../engine/component';
import type { Point } from '../../../engine/math-lib';
import { type BlendingMode } from '../../types/view';

interface RenderData {
  view: PixiBitmapText;
  graphicsContextKey?: string;
}

/** @inline */
type TextAlign = 'left' | 'center' | 'right';

/**
 * Options for {@link BitmapText}.
 *
 * @category Rendering
 */
export interface BitmapTextConfig {
  text?: string;
  font?: string;
  fontSize?: number;
  align?: TextAlign;
  color?: string;
  opacity?: number;
  blending?: BlendingMode;
  disabled?: boolean;
  sortingLayer?: string;
  sortOffset?: Point;
}

/**
 * Draws text with a bitmap font.
 *
 * @see [BitmapText](https://dachajs.org/systems/rendering/components/#bitmaptext)
 *
 * @category Rendering
 */
export class BitmapText extends Component {
  /** Text to render */
  text: string;
  /** Path to the font asset */
  font: string;
  /** Size of the text */
  fontSize: number;
  /** Alignment of the text
   * - left - Align text to the left edge
   * - center - Center text horizontally
   * - right - Align text to the right edge
   */
  align: TextAlign;
  /** Color of the text */
  color: string;
  /** Opacity of the text */
  opacity: number;
  /** Blending mode of the text */
  blending: BlendingMode;
  /** Whether the text is disabled */
  disabled: boolean;
  /** Sorting layer of the text */
  sortingLayer: string;
  /** Center point of the text */
  sortOffset: Point;
  /** @internal Rendering data owned by the renderer */
  renderData?: RenderData;

  constructor(config: BitmapTextConfig) {
    super();

    this.text = config.text ?? 'Text';
    this.font = config.font ?? '';
    this.fontSize = config.fontSize ?? 10;
    this.align = config.align ?? 'center';
    this.color = config.color ?? '#000000';
    this.opacity = config.opacity ?? 1;
    this.blending = config.blending ?? 'normal';
    this.disabled = config.disabled ?? false;
    this.sortingLayer = config.sortingLayer ?? 'default';
    this.sortOffset = {
      x: config.sortOffset?.x ?? 0,
      y: config.sortOffset?.y ?? 0,
    };
  }
}

BitmapText.componentName = 'BitmapText';
