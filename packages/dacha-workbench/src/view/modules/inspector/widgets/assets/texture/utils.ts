import type { TextureFilter } from 'dacha';

export const getImageRendering = (
  filter?: TextureFilter,
): 'pixelated' | 'auto' => (filter === 'linear' ? 'auto' : 'pixelated');
