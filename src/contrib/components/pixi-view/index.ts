import type { ViewContainer } from 'pixi.js';

import { Component } from '../../../engine/component';

interface RenderData {
  view: ViewContainer;
}

export interface PixiViewConfig {
  createView: () => ViewContainer;
  sortingLayer: string;
  sortCenter: [number, number];
}

export class PixiView extends Component {
  createView: () => ViewContainer;
  sortingLayer: string;
  sortCenter: [number, number];

  renderData?: RenderData;

  constructor(config: PixiViewConfig) {
    super();

    this.createView = config.createView;
    this.sortingLayer = config.sortingLayer;
    this.sortCenter = config.sortCenter;
  }

  get view(): ViewContainer | undefined {
    return this.renderData?.view;
  }

  clone(): PixiView {
    return new PixiView({
      createView: this.createView,
      sortingLayer: this.sortingLayer,
      sortCenter: this.sortCenter.slice(0) as [number, number],
    });
  }
}

PixiView.componentName = 'PixiView';
