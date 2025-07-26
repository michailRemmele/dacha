import type { Constructor } from '../../../types/utils';

import { ImageLoader } from './image-loader';
import { JsonLoader } from './json-loader';
import type { Loader } from './loader';

export const loaders: Record<string, Constructor<Loader>> = {
  imageLoader: ImageLoader,
  jsonLoader: JsonLoader,
};
