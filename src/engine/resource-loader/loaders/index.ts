import { ImageLoader } from './image-loader';
import { JsonLoader } from './json-loader';
import type { Loader } from './loader';

export const loaders: Record<string, { new(): Loader }> = {
  imageLoader: ImageLoader,
  jsonLoader: JsonLoader,
};
