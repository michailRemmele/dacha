import type { BitmapText } from 'pixi.js';

import { Component } from '../../../engine/component';
import { type BlendingMode } from '../../types/view';

interface RenderData {
  view: BitmapText;
  graphicsContextKey?: string;
}

type TextAlign = 'left' | 'center' | 'right';

export interface TextConfig {
  text: string;
  font: string;
  fontSize: number;
  align: TextAlign;
  fill: string;
  opacity: number;
  blending: BlendingMode;
  disabled: boolean;
  sortingLayer: string;
  sortCenter: [number, number];
}

export class Text extends Component {
  text: string;
  font: string;
  fontSize: number;
  align: TextAlign;
  fill: string;
  opacity: number;
  blending: BlendingMode;
  disabled: boolean;
  sortingLayer: string;
  sortCenter: [number, number];
  renderData?: RenderData;

  constructor(config: TextConfig) {
    super();

    this.text = config.text;
    this.font = config.font;
    this.fontSize = config.fontSize;
    this.align = config.align;
    this.fill = config.fill;
    this.opacity = config.opacity;
    this.blending = config.blending;
    this.disabled = config.disabled;
    this.sortingLayer = config.sortingLayer;
    this.sortCenter = config.sortCenter;
  }

  clone(): Text {
    return new Text({
      text: this.text,
      font: this.font,
      fontSize: this.fontSize,
      align: this.align,
      fill: this.fill,
      opacity: this.opacity,
      blending: this.blending,
      disabled: this.disabled,
      sortingLayer: this.sortingLayer,
      sortCenter: this.sortCenter.slice(0) as [number, number],
    });
  }
}

Text.componentName = 'Text';
