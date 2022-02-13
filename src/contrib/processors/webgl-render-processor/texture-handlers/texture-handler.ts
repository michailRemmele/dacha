import { Renderable } from '../../../components/renderable';

export interface TextureDescriptor {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TextureHandler {
  handle(descriptor: TextureDescriptor, renderable: Renderable): TextureDescriptor;
}
