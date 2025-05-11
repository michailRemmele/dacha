import type { TemplateCollection } from '../../../engine/template';
import { AudioSource } from '../../components';
import { traverseEntity } from '../../../engine/entity';

export const getAllTemplateSources = (templateCollection: TemplateCollection): string[] => {
  const templateSources: string[] = [];

  templateCollection.getAll().forEach((template) => {
    traverseEntity(template, (entity) => {
      const audioSource = entity.getComponent(AudioSource);
      if (audioSource?.src) {
        templateSources.push(audioSource.src);
      }
    });
  });

  return templateSources;
};

export const loadAudio = async (url: string): Promise<ArrayBuffer> => {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();

  return arrayBuffer;
};
