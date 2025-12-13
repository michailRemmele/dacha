import { type ViewContainer } from 'pixi.js';

import type { Builder } from '../builder';
import { PixiView } from '../../../../components/pixi-view';
import type { Actor } from '../../../../../engine/actor';

export class PixiViewBuilder implements Builder<PixiView> {
  destroy(pixiView: PixiView): void {
    pixiView.renderData?.view.destroy();
    pixiView.renderData = undefined;
  }

  buildView(pixiView: PixiView, actor: Actor): ViewContainer {
    const view = pixiView.createView();

    pixiView.renderData = { view };
    view.__dacha = {
      actor,
      builderKey: PixiView.componentName,
      viewComponent: pixiView,
      meta: {},
    };

    return view;
  }

  updateView(): void {
    // nothing to do
  }
}
