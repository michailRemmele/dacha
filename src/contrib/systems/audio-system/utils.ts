import type { Actor } from '../../../engine/actor';
import type { TemplateConfig } from '../../../engine/types';
import { AudioSource } from '../../components';
import { traverseEntity } from '../../../engine/entity';

export const getAllTemplateSources = (templates: TemplateConfig[]): string[] => {
  const sources: string[] = [];

  templates.forEach((template) => {
    traverseEntity(template, (entity) => {
      const audioSource = entity.components.find(
        (component) => component.name === AudioSource.componentName,
      );
      if (audioSource && typeof audioSource.config.src === 'string') {
        sources.push(audioSource.config.src);
      }
    });
  });

  return sources;
};

export const getAllSources = (actors: Actor[]): string[] => {
  const sources: string[] = [];

  actors.forEach((actor) => {
    traverseEntity(actor, (entity) => {
      const audioSource = entity.getComponent(AudioSource);
      if (audioSource?.src) {
        sources.push(audioSource.src);
      }
    });
  });

  return sources;
};

export const loadAudio = async (url: string): Promise<ArrayBuffer> => {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();

  return arrayBuffer;
};
