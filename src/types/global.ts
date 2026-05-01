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
        sortOffset: { x: number; y: number };
      };
      meta: Record<string, unknown>;
      /**
       * Flag to indicate if the view is fully initialized and ready (parent set and position updated)
       */
      isReady?: boolean;
    };
  }
  interface Filter {
    __dacha: {
      version?: number;
      meta: Record<string, unknown>;
    };
  }
  interface Shader {
    __dacha: {
      version?: number;
      meta: Record<string, unknown>;
    };
  }
}
