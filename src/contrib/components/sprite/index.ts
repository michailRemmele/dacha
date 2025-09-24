import type { Sprite as PixiSprite, TilingSprite } from 'pixi.js';

import { Component } from '../../../engine/component';
import { type BlendingMode } from '../../types/view';

interface RenderData {
  view: PixiSprite | TilingSprite;
  textureSourceKey?: string;
  textureArrayKey?: string;
}

type FitType = 'stretch' | 'repeat';

export { type BlendingMode } from '../../types/view';

export interface SpriteConfig {
  src: string;
  width: number;
  height: number;
  slice: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
  sortingLayer: string;
  sortCenter: [number, number];
  fit: FitType;
  color: string;
  blending: BlendingMode;
  opacity: number;
  disabled: boolean;
}

export class Sprite extends Component {
  src: string;
  width: number;
  height: number;
  slice: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
  disabled: boolean;
  sortingLayer: string;
  sortCenter: [number, number];
  currentFrame?: number;
  readonly fit: FitType;
  color: string;
  blending: BlendingMode;
  opacity: number;
  renderData?: RenderData;

  constructor(config: SpriteConfig) {
    super();

    this.src = config.src;
    this.width = config.width;
    this.height = config.height;
    this.slice = config.slice;
    this.currentFrame = 0;
    this.rotation = config.rotation;
    this.flipX = config.flipX;
    this.flipY = config.flipY;
    this.disabled = config.disabled;
    this.sortingLayer = config.sortingLayer;
    this.sortCenter = config.sortCenter;
    this.fit = config.fit;
    this.color = config.color ?? '#ffffff';
    this.blending = config.blending ?? 'normal';
    this.opacity = config.opacity ?? 1;
  }

  clone(): Sprite {
    return new Sprite({
      src: this.src,
      width: this.width,
      height: this.height,
      slice: this.slice,
      rotation: this.rotation,
      flipX: this.flipX,
      flipY: this.flipY,
      disabled: this.disabled,
      sortingLayer: this.sortingLayer,
      sortCenter: this.sortCenter.slice(0) as [number, number],
      fit: this.fit,
      color: this.color,
      blending: this.blending,
      opacity: this.opacity,
    });
  }
}

Sprite.componentName = 'Sprite';
