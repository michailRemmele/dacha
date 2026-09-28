import type { FC } from 'react';
import * as Dacha from 'dacha';

import { EditorMarker } from '../engine/components';
import type { WidgetProps } from '../types/widget-schema';
import { AnimatableWidget } from '../view/modules/inspector/widgets/components/animatable/view';
import { BehaviorsWidget } from '../view/modules/inspector/widgets/components/behaviors/view';
import { KeyboardControlWidget } from '../view/modules/inspector/widgets/components/keyboard-control/view';
import { MeshWidget } from '../view/modules/inspector/widgets/components/mesh/view';
import { MouseControlWidget } from '../view/modules/inspector/widgets/components/mouse-control/view';
import { RendererWidget } from '../view/modules/inspector/widgets/systems/renderer/view';

const EXCLUDED_BUILTINS = new Set<unknown>([Dacha.PixiView]);

export const BUILTIN_CANDIDATES: unknown[] = [
  ...Object.values(Dacha).filter((value) => !EXCLUDED_BUILTINS.has(value)),
  EditorMarker,
];

export const builtinViews: Record<string, FC<WidgetProps>> = {
  Animatable: AnimatableWidget,
  Behaviors: BehaviorsWidget,
  KeyboardControl: KeyboardControlWidget,
  Mesh: MeshWidget,
  MouseControl: MouseControlWidget,
  Renderer: RendererWidget,
};
