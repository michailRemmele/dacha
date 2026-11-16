import type { FC } from 'react';
import * as Dacha from 'dacha';
import type { SchemaKind } from 'dacha';

import { EditorMarker } from '../engine/components';
import type { WidgetProps } from '../types/widget-schema';
import { AnimatableWidget } from '../view/modules/inspector/widgets/components/animatable/view';
import { KeyboardControlWidget } from '../view/modules/inspector/widgets/components/keyboard-control/view';
import { MouseControlWidget } from '../view/modules/inspector/widgets/components/mouse-control/view';
import { TextureWidget } from '../view/modules/inspector/widgets/assets/texture/view';
import { AudioWidget } from '../view/modules/inspector/widgets/assets/audio/view';
import { BitmapFontWidget } from '../view/modules/inspector/widgets/assets/bitmap-font/view';

const EXCLUDED_BUILTINS = new Set<unknown>([Dacha.PixiView]);

export const BUILTIN_CANDIDATES: unknown[] = [
  ...Object.values(Dacha).filter((value) => !EXCLUDED_BUILTINS.has(value)),
  EditorMarker,
];

export const builtinViews: Partial<
  Record<SchemaKind, Record<string, FC<WidgetProps>>>
> = {
  component: {
    Animatable: AnimatableWidget,
    KeyboardControl: KeyboardControlWidget,
    MouseControl: MouseControlWidget,
  },
  asset: {
    texture: TextureWidget,
    audio: AudioWidget,
    bitmapFont: BitmapFontWidget,
  },
};
