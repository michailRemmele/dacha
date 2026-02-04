import { Assets as PixiAssets, type BitmapFont } from 'pixi.js';

import { Actor } from '../../../../engine/actor';
import { Scene } from '../../../../engine/scene';
import { type TemplateCollection } from '../../../../engine/template';
import { Sprite } from '../../../components/sprite';
import { Mesh } from '../../../components/mesh';
import { BitmapText } from '../../../components/bitmap-text';
import { CacheStore } from '../../../../engine/data-lib';
import type { ViewComponent } from '../types';

import { getAllImageSources, getAllFontSources, loadImage } from './utils';

interface AssetsOptions {
  templateCollection: TemplateCollection;
}

export class Assets {
  private templateCollection: TemplateCollection;
  private imageStore: CacheStore<HTMLImageElement>;

  constructor({ templateCollection }: AssetsOptions) {
    this.templateCollection = templateCollection;

    this.imageStore = new CacheStore<HTMLImageElement>();
  }

  async load(entity: Actor | Scene | ViewComponent): Promise<void> {
    if (entity instanceof Scene) {
      const allImageSources = [
        ...getAllImageSources(this.templateCollection.getAll()),
        ...getAllImageSources(entity.children),
      ];
      const uniqueImageSources = [...new Set(allImageSources)];

      const images = await Promise.all(
        uniqueImageSources.map((src) => {
          return !this.imageStore.has(src) ? loadImage(src) : undefined;
        }),
      );

      uniqueImageSources.forEach((src, index) => {
        if (images[index]) {
          this.imageStore.add(src, images[index]!);
        }
      });
      allImageSources.forEach((src) => this.imageStore.retain(src));

      const allFontSources = [
        ...getAllFontSources(this.templateCollection.getAll()),
        ...getAllFontSources(entity.children),
      ];
      const uniqueFontSources = [...new Set(allFontSources)];

      await PixiAssets.load(uniqueFontSources);

      return;
    }

    if (entity instanceof Actor) {
      const sprite = entity.getComponent(Sprite);
      if (sprite) {
        await this.loadViewImage(sprite.src);
      }

      const mesh = entity.getComponent(Mesh);
      if (mesh) {
        await this.loadViewImage(mesh.src);
      }

      const text = entity.getComponent(BitmapText);
      if (text) {
        await PixiAssets.load(text.font);
      }

      return;
    }

    if (entity instanceof Sprite || entity instanceof Mesh) {
      await this.loadViewImage(entity.src);
    }
  }

  unload(entity: Scene | Actor | ViewComponent): void {
    if (entity instanceof Scene) {
      const allSources = [
        ...getAllImageSources(this.templateCollection.getAll()),
        ...getAllImageSources(entity.children),
      ];

      allSources.forEach((src) => this.imageStore.release(src));
      this.imageStore.cleanReleased();
      return;
    }

    if (entity instanceof Actor) {
      const sprite = entity.getComponent(Sprite);
      if (sprite) {
        this.imageStore.release(sprite.src);
      }
      return;
    }

    if (entity instanceof Sprite) {
      this.imageStore.release(entity.src);
    }
  }

  get(view: Sprite | Mesh): HTMLImageElement | undefined;
  get(view: BitmapText): BitmapFont | undefined;
  get(view: Sprite | Mesh | BitmapText): unknown {
    if (view instanceof Sprite || view instanceof Mesh) {
      return this.imageStore.get(view.src);
    }

    if (view instanceof BitmapText) {
      // @ts-expect-error, comment: In order to avoid warning spam if value is missing
      return PixiAssets.cache._cache.get(view.font);
    }
  }

  private async loadViewImage(src: string): Promise<void> {
    if (this.imageStore.has(src)) {
      this.imageStore.retain(src);
    } else {
      const image = await loadImage(src);
      if (image) {
        this.imageStore.add(src, image);
        this.imageStore.retain(src);
      }
    }
  }
}
