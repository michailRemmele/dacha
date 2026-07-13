import type { Sprite as PixiSprite, TilingSprite } from 'pixi.js';

import { Component } from '../../../engine/component';
import type { Point } from '../../../engine/math-lib';
import { type BlendingMode } from '../../types/view';

interface RenderData {
  view: PixiSprite | TilingSprite;
  textureSourceKey?: string;
  textureArrayKey?: string;
}

type FitType = 'stretch' | 'repeat';

export { type BlendingMode } from '../../types/view';

export interface SpriteConfig {
  src?: string;
  width?: number;
  height?: number;
  slice?: number;
  flipX?: boolean;
  flipY?: boolean;
  sortingLayer?: string;
  sortOffsetX?: number;
  sortOffsetY?: number;
  textureOffsetX?: number;
  textureOffsetY?: number;
  fit?: FitType;
  color?: string;
  blending?: BlendingMode;
  opacity?: number;
  disabled?: boolean;
}

/**
 * Sprite component for rendering 2D textures.
 *
 * Handles the visual representation of an actor using a texture.
 * It can be used to render a single texture or a texture slice from a sprite sheet.
 *
 * @example
 * ```typescript
 * // Create a basic sprite
 * const sprite = new Sprite({
 *   src: 'assets/player.png',
 *   width: 64,
 *   height: 64,
 *   slice: 0,
 *   flipX: false,
 *   flipY: false,
 *   sortingLayer: 'units',
 *   sortOffsetX: 0,
 *   sortOffsetY: 0,
 *   fit: 'stretch',
 *   color: '#ffffff',
 *   blending: 'normal',
 *   opacity: 1,
 *   disabled: false
 * });
 *
 * // Add to actor
 * actor.setComponent(sprite);
 *
 * // Modify properties
 * sprite.opacity = 0.5; // Make semi-transparent
 * sprite.color = '#ff0000'; // Apply a red tint
 * ```
 *
 * @category Components
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
  /** Internal rendering data */
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
      x: config.sortOffsetX ?? 0,
      y: config.sortOffsetY ?? 0,
    };
    this.textureOffset = {
      x: config.textureOffsetX ?? 0,
      y: config.textureOffsetY ?? 0,
    };
    this.fit = config.fit ?? 'stretch';
    this.color = config.color ?? '#ffffff';
    this.blending = config.blending ?? 'normal';
    this.opacity = config.opacity ?? 1;
  }
}

Sprite.componentName = 'Sprite';
