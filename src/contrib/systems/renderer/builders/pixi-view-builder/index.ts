import { Bounds, type ViewContainer } from 'pixi.js';

import type { Builder } from '../builder';
import { Transform } from '../../../../components/transform';
import { PixiView } from '../../../../components/pixi-view';
import type { Actor } from '../../../../../engine/actor';

export class PixiViewBuilder implements Builder {
  destroy(actor: Actor): void {
    const pixiView = actor.getComponent(PixiView);

    pixiView.renderData?.view.destroy();
    pixiView.renderData = undefined;
  }

  buildView(actor: Actor): ViewContainer | undefined {
    const pixiView = actor.getComponent(PixiView);
    if (!pixiView) {
      return undefined;
    }

    const { offsetX, offsetY } = actor.getComponent(Transform);
    const view = pixiView.buildView();

    pixiView.renderData = { view };
    view.__dacha = {
      actor,
      builderKey: PixiView.componentName,
      viewComponent: pixiView,
      bounds: new Bounds(offsetX, offsetY, offsetX, offsetY),
      meta: {},
      didChange: false,
    };

    return view;
  }

  updateView(): void {
    // nothing to do
  }
}
