import type { BitmapText as PixiBitmapText } from 'pixi.js';

import { Component } from '../../../engine/component';
import { DefineComponent, DefineField } from '../../../engine/decorators';
import { sortingLayerOptions } from '../../systems/renderer/sorting-layer-options';
import type { Point } from '../../../engine/math-lib';
import { type BlendingMode } from '../../systems/renderer/blending-mode';

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
@DefineComponent({
  name: 'BitmapText',
  icon: 'Font',
  sections: { text: { defaultOpen: true } },
})
export class BitmapText extends Component<BitmapTextConfig> {
  /** Text to render */
  @DefineField({ type: 'textarea', initialValue: 'Text', section: 'text' })
  text!: string;
  /** Path to the font asset */
  @DefineField({
    type: 'file',
    initialValue: '',
    section: 'text',
    extensions: ['fnt', 'xml'],
  })
  font!: string;
  /** Size of the text */
  @DefineField({ initialValue: 10, section: 'text' })
  fontSize!: number;
  /** Alignment of the text
   * - left - Align text to the left edge
   * - center - Center text horizontally
   * - right - Align text to the right edge
   */
  @DefineField({
    type: 'select',
    initialValue: 'center',
    section: 'text',
    options: ['left', 'center', 'right', 'justify'],
  })
  align!: TextAlign;
  /** Color of the text */
  @DefineField({
    type: 'color',
    initialValue: '#000000',
    section: 'appearance',
  })
  color!: string;
  /** Opacity of the text */
  @DefineField({ initialValue: 1, section: 'appearance' })
  opacity!: number;
  /** Blending mode of the text */
  @DefineField({
    type: 'select',
    initialValue: 'normal',
    section: 'appearance',
    options: ['normal', 'addition', 'subtract', 'multiply'],
  })
  blending!: BlendingMode;
  /** Center point of the text */
  @DefineField({ initialValue: { x: 0, y: 0 }, section: 'sorting' })
  sortOffset!: Point;
  /** Sorting layer of the text */
  @DefineField({
    type: 'select',
    initialValue: 'default',
    section: 'sorting',
    options: sortingLayerOptions,
  })
  sortingLayer!: string;
  /** Whether the text is disabled */
  @DefineField({ initialValue: false })
  disabled!: boolean;

  /** @internal Rendering data owned by the renderer */
  renderData?: RenderData;
}
