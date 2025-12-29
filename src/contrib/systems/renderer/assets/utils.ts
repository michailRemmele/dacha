import { Sprite } from '../../../components/sprite';
import { BitmapText } from '../../../components/bitmap-text';
import type { Actor } from '../../../../engine/actor';
import type { Template } from '../../../../engine/template';
import { ResourceLoader } from '../../../../engine/resource-loader';
import { traverseEntity } from '../../../../engine/entity';

const resourceLoader = new ResourceLoader();

export const loadImage = async (
  url?: string,
): Promise<HTMLImageElement | undefined> => {
  if (!url) {
    return undefined;
  }

  try {
    const image = (await resourceLoader.load(url)) as Promise<HTMLImageElement>;
    return image;
  } catch (error: unknown) {
    console.warn(`Can't load image by the following url: ${url}`, error);
    return undefined;
  }
};

export const getAllImageSources = (actors: (Actor | Template)[]): string[] => {
  const sources: string[] = [];

  actors.forEach((actor) => {
    traverseEntity(actor, (entity) => {
      const sprite = entity.getComponent(Sprite);
      if (sprite?.src) {
        sources.push(sprite.src);
      }
    });
  });

  return sources;
};

export const getAllFontSources = (actors: (Actor | Template)[]): string[] => {
  const sources: string[] = [];

  actors.forEach((actor) => {
    traverseEntity(actor, (entity) => {
      const text = entity.getComponent(BitmapText);
      if (text?.font) {
        sources.push(text.font);
      }
    });
  });

  return sources;
};
