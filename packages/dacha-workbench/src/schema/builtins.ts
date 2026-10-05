import type { FC } from 'react';
import * as Dacha from 'dacha';

import { EditorMarker } from '../engine/components';
import type { WidgetProps } from '../types/widget-schema';
import { AnimatableWidget } from '../view/modules/inspector/widgets/components/animatable/view';
import { KeyboardControlWidget } from '../view/modules/inspector/widgets/components/keyboard-control/view';
import { MouseControlWidget } from '../view/modules/inspector/widgets/components/mouse-control/view';

const EXCLUDED_BUILTINS = new Set<unknown>([Dacha.PixiView]);

export const BUILTIN_CANDIDATES: unknown[] = [
  ...Object.values(Dacha).filter((value) => !EXCLUDED_BUILTINS.has(value)),
  EditorMarker,
];

export const builtinViews: Record<string, FC<WidgetProps>> = {
  Animatable: AnimatableWidget,
  KeyboardControl: KeyboardControlWidget,
  MouseControl: MouseControlWidget,
};
