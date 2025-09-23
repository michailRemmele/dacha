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

export class BitmapText extends Component {
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
