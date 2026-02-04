import '../engine/events';
import '../contrib/events';
import { type Actor } from '../engine/actor';
import { type Component } from '../engine/component';

declare module 'pixi.js' {
  interface Container {
    /**
     * Custom property to store engine specific data and link pixi.js view with Actor
     */
    __dacha: {
      meta: Record<string, unknown>;
    };
  }
  interface ViewContainer {
    /**
     * Custom property to store engine specific data and link pixi.js view with Actor
     */
    __dacha: {
      actor: Actor;
      builderKey: string;
      viewComponent: Component & {
        sortingLayer: string;
        sortCenter: [number, number];
      };
      meta: Record<string, unknown>;
    };
  }
  interface Filter {
    __dacha: {
      name: string;
    };
  }
}
