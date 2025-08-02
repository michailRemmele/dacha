import { type Bounds } from 'pixi.js';

import '../engine/events';
import '../contrib/events';
import { type Actor } from '../engine/actor';

declare module 'pixi.js' {
  interface ViewContainer {
    /**
     * Custom property to store engine specific data and link pixi.js view with Actor
     */
    __dacha: {
      actor: Actor;
      builderKey: string;
      viewComponent: {
        sortingLayer: string;
        sortCenter: [number, number];
      };
      bounds: Bounds;
    };
  }
}
