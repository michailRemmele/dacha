import type { ViewContainer } from 'pixi.js';

import { Component } from '../../../engine/component';

interface RenderData {
  view: ViewContainer;
}

export interface PixiViewConfig {
  buildView: () => ViewContainer;
  sortingLayer: string;
  sortCenter: [number, number];
}

export class PixiView extends Component {
  buildView: () => ViewContainer;
  sortingLayer: string;
  sortCenter: [number, number];

  renderData?: RenderData;

  constructor(config: PixiViewConfig) {
    super();

    this.buildView = config.buildView;
    this.sortingLayer = config.sortingLayer;
    this.sortCenter = config.sortCenter;
  }

  clone(): PixiView {
    return new PixiView({
      buildView: this.buildView,
      sortingLayer: this.sortingLayer,
      sortCenter: this.sortCenter.slice(0) as [number, number],
    });
  }
}

PixiView.componentName = 'PixiView';
