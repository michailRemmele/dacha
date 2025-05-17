import type { Actor } from '../../../engine/actor';
import type { Template } from '../../../engine/template';
import { AudioSource } from '../../components';
import { traverseEntity } from '../../../engine/entity';

export const getAllSources = (actors: (Actor | Template)[]): string[] => {
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
