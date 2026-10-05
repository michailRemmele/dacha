import type { Sprite as PixiSprite, TilingSprite } from 'pixi.js';

import { Component } from '../../../engine/component';
import { DefineComponent, DefineField } from '../../../engine/decorators';
import { sortingLayerOptions } from '../../systems/renderer/sorting-layer-options';
import type { Point } from '../../../engine/math-lib';
import { type BlendingMode } from '../../systems/renderer/blending-mode';

interface RenderData {
  view: PixiSprite | TilingSprite;
  textureSourceKey?: string;
  textureArrayKey?: string;
}

/** @inline */
type FitType = 'stretch' | 'repeat';

export { type BlendingMode } from '../../systems/renderer/blending-mode';

/**
 * Options for {@link Sprite}.
 *
 * @category Rendering
 */
export interface SpriteConfig {
  src?: string;
  width?: number;
  height?: number;
  slice?: number;
  flipX?: boolean;
  flipY?: boolean;
  sortingLayer?: string;
  sortOffset?: Point;
  textureOffset?: Point;
  fit?: FitType;
  color?: string;
  blending?: BlendingMode;
  opacity?: number;
  disabled?: boolean;
}

/**
 * Draws an image, a frame of a sprite sheet, or a tiled image.
 *
 * @see [Sprite](https://dachajs.org/systems/rendering/components/#sprite)
 *
 * @category Rendering
 */
@DefineComponent({
  name: 'Sprite',
  icon: 'Picture',
  sections: { texture: { defaultOpen: true } },
})
export class Sprite extends Component<SpriteConfig> {
  /** Path to the texture image file */
  @DefineField({
    type: 'file',
    initialValue: '',
    section: 'texture',
    extensions: ['png'],
  })
  src!: string;
  /** Width of the sprite in pixels */
  @DefineField({ initialValue: 10, section: 'texture' })
  width!: number;
  /** Height of the sprite in pixels */
  @DefineField({ initialValue: 10, section: 'texture' })
  height!: number;
  /** Number of frames in the sprite sheet */
  @DefineField({ initialValue: 1, section: 'texture' })
  slice!: number;
  /** How the texture should fit within the sprite bounds */
  @DefineField({
    type: 'select',
    initialValue: 'stretch',
    section: 'texture',
    options: ['stretch', 'repeat'],
  })
  readonly fit!: FitType;
  /**
   * Texture sampling offset in pixels. Only applies to `fit: 'repeat'`.
   * With flipX/flipY the tile is mirrored, so a positive offset scrolls in
   * the mirrored direction.
   */
  @DefineField({
    initialValue: { x: 0, y: 0 },
    section: 'texture',
    dependency: { name: 'fit', value: 'repeat' },
  })
  textureOffset!: Point;
  /** Whether to flip the sprite horizontally */
  @DefineField({ initialValue: false, section: 'texture' })
  flipX!: boolean;
  /** Whether to flip the sprite vertically */
  @DefineField({ initialValue: false, section: 'texture' })
  flipY!: boolean;
  /** Color tint applied to the sprite */
  @DefineField({
    type: 'color',
    initialValue: '#ffffff',
    section: 'appearance',
    disabledAlpha: true,
  })
  color!: string;
  /** Blending mode for rendering */
  @DefineField({
    type: 'select',
    initialValue: 'normal',
    section: 'appearance',
    options: ['normal', 'addition', 'subtract', 'multiply'],
  })
  blending!: BlendingMode;
  /** Opacity from 0 (transparent) to 1 (opaque) */
  @DefineField({ initialValue: 1, section: 'appearance' })
  opacity!: number;
  /** Center point for sorting calculations */
  @DefineField({ initialValue: { x: 0, y: 0 }, section: 'sorting' })
  sortOffset!: Point;
  /** Sorting layer name for rendering order */
  @DefineField({
    type: 'select',
    initialValue: 'default',
    section: 'sorting',
    options: sortingLayerOptions,
  })
  sortingLayer!: string;
  /** Whether the sprite is disabled and should not render */
  @DefineField({ initialValue: false })
  disabled!: boolean;

  /** Current frame to render */
  currentFrame?: number = 0;
  /** @internal Rendering data owned by the renderer */
  renderData?: RenderData;
}
