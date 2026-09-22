import type { Sprite as PixiSprite, TilingSprite } from 'pixi.js';

import { Component } from '../../../engine/component';
import type { Point } from '../../../engine/math-lib';
import { type BlendingMode } from '../../types/view';

interface RenderData {
  view: PixiSprite | TilingSprite;
  textureSourceKey?: string;
  textureArrayKey?: string;
}

/** @inline */
type FitType = 'stretch' | 'repeat';

export { type BlendingMode } from '../../types/view';

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
export class Sprite extends Component {
  /** Path to the texture image file */
  src: string;
  /** Width of the sprite in pixels */
  width: number;
  /** Height of the sprite in pixels */
  height: number;
  /** Amount of frames in the sprite sheet */
  slice: number;
  /** Whether to flip the sprite horizontally */
  flipX: boolean;
  /** Whether to flip the sprite vertically */
  flipY: boolean;
  /** Whether the sprite is disabled and should not render */
  disabled: boolean;
  /** Sorting layer name for rendering order */
  sortingLayer: string;
  /** Center point for sorting calculations */
  sortOffset: Point;
  /**
   * Texture sampling offset in pixels. Only applies to `fit: 'repeat'`
   * With flipX/flipY the tile is mirrored, so a positive offset scrolls in
   * the mirrored direction.
   */
  textureOffset: Point;
  /** Current frame to render */
  currentFrame?: number;
  /** How the texture should fit within the sprite bounds */
  readonly fit: FitType;
  /** Color tint applied to the sprite */
  color: string;
  /** Blending mode for rendering */
  blending: BlendingMode;
  /** Opacity from 0 (transparent) to 1 (opaque) */
  opacity: number;
  /** @internal Rendering data owned by the renderer */
  renderData?: RenderData;

  /**
   * Creates a new Sprite component.
   *
   * @param config - Configuration for the sprite
   */
  constructor(config: SpriteConfig) {
    super();

    this.src = config.src ?? '';
    this.width = config.width ?? 10;
    this.height = config.height ?? 10;
    this.slice = config.slice ?? 1;
    this.currentFrame = 0;
    this.flipX = config.flipX ?? false;
    this.flipY = config.flipY ?? false;
    this.disabled = config.disabled ?? false;
    this.sortingLayer = config.sortingLayer ?? 'default';
    this.sortOffset = {
      x: config.sortOffset?.x ?? 0,
      y: config.sortOffset?.y ?? 0,
    };
    this.textureOffset = {
      x: config.textureOffset?.x ?? 0,
      y: config.textureOffset?.y ?? 0,
    };
    this.fit = config.fit ?? 'stretch';
    this.color = config.color ?? '#ffffff';
    this.blending = config.blending ?? 'normal';
    this.opacity = config.opacity ?? 1;
  }
}

Sprite.componentName = 'Sprite';
