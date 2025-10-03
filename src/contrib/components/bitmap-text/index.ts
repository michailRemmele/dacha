import type { BitmapText as PixiBitmapText } from 'pixi.js';

import { Component } from '../../../engine/component';
import { type BlendingMode } from '../../types/view';

interface RenderData {
  view: PixiBitmapText;
  graphicsContextKey?: string;
}

type TextAlign = 'left' | 'center' | 'right';

export interface BitmapTextConfig {
  text: string;
  font: string;
  fontSize: number;
  align: TextAlign;
  color: string;
  opacity: number;
  blending: BlendingMode;
  disabled: boolean;
  sortingLayer: string;
  sortCenter: [number, number];
}

/**
 * BitmapText component for rendering text using a bitmap font.
 *
 * It handles text representation of an actor using a bitmap font.
 * It uses an asset file in the format of a bitmap font (.fnt and .xml are supported) to render text.
 *
 * @example
 * ```typescript
 * // Create a bitmap text
 * const bitmapText = new BitmapText({
 *   text: 'Greetings traveller!',
 *   font: 'assets/fonts/some-pixel-font.fnt',
 *   fontSize: 24,
 *   align: 'center',
 *   color: '#000',
 *   opacity: 1,
 *   blending: 'normal',
 *   disabled: false,
 *   sortingLayer: 'text',
 *   sortCenter: [0, 0],
 * });
 *
 * // Add to actor
 * actor.setComponent(bitmapText);
 *
 * // Modify properties
 * bitmapText.text = 'Stay a while and listen!';
 * ```
 * 
 * @category Components
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
  sortCenter: [number, number];
  /** Internal rendering data */
  renderData?: RenderData;

  constructor(config: BitmapTextConfig) {
    super();

    this.text = config.text;
    this.font = config.font;
    this.fontSize = config.fontSize;
    this.align = config.align;
    this.color = config.color;
    this.opacity = config.opacity;
    this.blending = config.blending;
    this.disabled = config.disabled;
    this.sortingLayer = config.sortingLayer;
    this.sortCenter = config.sortCenter;
  }

  clone(): BitmapText {
    return new BitmapText({
      text: this.text,
      font: this.font,
      fontSize: this.fontSize,
      align: this.align,
      color: this.color,
      opacity: this.opacity,
      blending: this.blending,
      disabled: this.disabled,
      sortingLayer: this.sortingLayer,
      sortCenter: this.sortCenter.slice(0) as [number, number],
    });
  }
}

BitmapText.componentName = 'BitmapText';
