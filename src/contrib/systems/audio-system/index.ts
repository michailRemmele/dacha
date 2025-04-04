import { System } from '../../../engine/system';
import type { Scene } from '../../../engine/scene';
import type { SystemOptions } from '../../../engine/system';
import type { TemplateCollection } from '../../../engine/template';
import { Actor, ActorCollection } from '../../../engine/actor';
import { AddActor, RemoveActor } from '../../../engine/events';
import type { AddActorEvent, RemoveActorEvent } from '../../../engine/events';
import { AudioSource } from '../../components';
import {
  PlayAudio,
  StopAudio,
  SetAudioVolume,
} from '../../../events';
import type {
  SetAudioGroupVolumeEvent,
  SetAudioSourceVolumeEvent,
} from '../../../events';
import type { ActorEvent } from '../../../types/events';

import { audioLoader } from './audio-loader';
import type { AudioGroups, AudioStateNode } from './types';

const MASTER_GROUP = 'master';
const VOLUME_TOLERANCE = 0.001;

export class AudioSystem extends System {
  private templateCollection: TemplateCollection;
  private actorCollection: ActorCollection;
  private scene: Scene;

  private audioContext: AudioContext;
  private audioGroups: Record<string, GainNode | undefined>;
  private audioCache: Map<string, AudioBuffer>;
  private audioState: Map<string, AudioStateNode>;

  constructor(options: SystemOptions) {
    super();

    const { scene, globalOptions, templateCollection } = options;

    this.templateCollection = templateCollection;
    this.actorCollection = new ActorCollection(scene, {
      components: [AudioSource],
    });
    this.scene = scene;

    this.audioContext = new AudioContext();

    const masterAudioGroup = new GainNode(this.audioContext);

    masterAudioGroup.connect(this.audioContext.destination);

    const audioGroupsOption = globalOptions.audioGroups as AudioGroups | undefined;
    const audioGroupsSettings = audioGroupsOption?.groups ?? [];
    this.audioGroups = audioGroupsSettings.reduce((acc, groupSettings) => {
      if (groupSettings.name === MASTER_GROUP) {
        return acc;
      }

      const gainNode = new GainNode(this.audioContext);
      gainNode.gain.value = groupSettings.volume;

      gainNode.connect(masterAudioGroup);

      acc[groupSettings.name] = gainNode;
      return acc;
    }, { [MASTER_GROUP]: masterAudioGroup } as Record<string, GainNode | undefined>);

    this.audioCache = new Map();
    this.audioState = new Map();
  }

  async load(): Promise<void> {
    const templateSources = this.templateCollection.getAll()
      .filter((template) => template.getComponent(AudioSource))
      .map((template) => template.getComponent(AudioSource).src);

    const sources = this.actorCollection.map((actor) => actor.getComponent(AudioSource).src);

    const uniqueSources = [...new Set([...templateSources, ...sources])];

    await Promise.all(uniqueSources.map((src) => this.loadAudio(src)));
  }

  private async loadAudio(audioSourcePath: string): Promise<void> {
    if (this.audioCache.has(audioSourcePath)) {
      return;
    }

    try {
      const arrayBuffer = await audioLoader.load(audioSourcePath);
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.audioCache.set(audioSourcePath, audioBuffer);
    } catch (error: unknown) {
      console.error(`An error occurred during audio source loading: ${audioSourcePath}`, error);
    }
  }

  mount(): void {
    this.actorCollection.forEach((actor) => this.initAudio(actor));

    this.actorCollection.addEventListener(AddActor, this.handleActorAdd);
    this.actorCollection.addEventListener(RemoveActor, this.handleActorRemove);

    this.scene.addEventListener(PlayAudio, this.handlePlayAudio);
    this.scene.addEventListener(StopAudio, this.handleStopAudio);
    this.scene.addEventListener(SetAudioVolume, this.handleSetAudioVolume);

    window.addEventListener('click', this.resumeIfSuspended, { once: true });
    window.addEventListener('keydown', this.resumeIfSuspended, { once: true });
    window.addEventListener('touchstart', this.resumeIfSuspended, { once: true });
  }

  unmount(): void {
    this.audioState.forEach((audioState) => {
      audioState.sourceNode.stop();
    });

    void this.audioContext.close();

    this.actorCollection.removeEventListener(AddActor, this.handleActorAdd);
    this.actorCollection.removeEventListener(RemoveActor, this.handleActorRemove);

    this.scene.removeEventListener(PlayAudio, this.handlePlayAudio);
    this.scene.removeEventListener(StopAudio, this.handleStopAudio);
    this.scene.removeEventListener(SetAudioVolume, this.handleSetAudioVolume);

    window.removeEventListener('click', this.resumeIfSuspended);
    window.removeEventListener('keydown', this.resumeIfSuspended);
    window.removeEventListener('touchstart', this.resumeIfSuspended);
  }

  private handleActorAdd = (event: AddActorEvent): void => {
    this.initAudio(event.actor);
  };

  private handleActorRemove = (event: RemoveActorEvent): void => {
    this.stopAudio(event.actor);
  };

  private handlePlayAudio = (event: ActorEvent): void => {
    this.playAudio(event.target);
  };

  private handleStopAudio = (event: ActorEvent): void => {
    this.stopAudio(event.target);
  };

  private handleSetAudioVolume = (
    event: SetAudioGroupVolumeEvent | SetAudioSourceVolumeEvent,
  ): void => {
    if (event.target instanceof Actor) {
      const audioSource = event.target.getComponent(AudioSource);

      if (!audioSource) {
        return;
      }

      audioSource.volume = event.value;
    } else {
      const audioGroup = this.audioGroups[(event as SetAudioGroupVolumeEvent).group];

      if (!audioGroup) {
        return;
      }

      audioGroup.gain.value = event.value;
    }
  };

  private resumeIfSuspended = (): void => {
    if (this.audioContext.state === 'suspended') {
      void this.audioContext
        .resume()
        .catch((err: unknown) => {
          console.warn('Cannot resume a audio context', err);
        });
    }
  };

  private initAudio(actor: Actor): void {
    const audioSource = actor.getComponent(AudioSource);
    if (audioSource.autoplay) {
      this.playAudio(actor);
    }
  }

  private playAudio(actor: Actor): void {
    const audioSource = actor.getComponent(AudioSource);

    if (!audioSource) {
      return;
    }

    const {
      src, group, volume, looped, playing,
    } = audioSource;
    const audioGroupNode = this.audioGroups[group];

    if (!audioGroupNode || !this.audioCache.has(src)) {
      return;
    }

    if (playing && this.audioState.has(actor.id)) {
      const prevAudio = this.audioState.get(actor.id)!;
      prevAudio.sourceNode.removeEventListener('ended', prevAudio.properties.endedListener);
      prevAudio.sourceNode.stop();
      prevAudio.gainNode.disconnect();
    }

    const sourceNode = new AudioBufferSourceNode(this.audioContext, {
      buffer: this.audioCache.get(src),
      loop: looped,
    });
    const gainNode = new GainNode(this.audioContext, {
      gain: volume,
    });

    const endedListener = (): void => this.stopAudio(actor);

    sourceNode.connect(gainNode).connect(audioGroupNode);
    sourceNode.addEventListener('ended', endedListener);
    sourceNode.start();

    this.audioState.set(actor.id, {
      sourceNode,
      gainNode,
      properties: { volume, group, endedListener },
    });
    audioSource.playing = true;
  }

  private stopAudio(actor: Actor): void {
    const audioSource = actor.getComponent(AudioSource) as AudioSource | undefined;

    if (audioSource) {
      audioSource.playing = false;
    }

    const audioState = this.audioState.get(actor.id);

    if (!audioState) {
      return;
    }

    audioState.sourceNode.stop();
    audioState.gainNode.disconnect();
    this.audioState.delete(actor.id);
  }

  private updateAudio(actor: Actor): void {
    const audioSource = actor.getComponent(AudioSource);
    const audioState = this.audioState.get(actor.id) as AudioStateNode;

    if (Math.abs(audioSource.volume - audioState.properties.volume) > VOLUME_TOLERANCE) {
      audioState.gainNode.gain.value = audioSource.volume;
    }
  }

  update(): void {
    this.actorCollection.forEach((actor) => {
      const audioSource = actor.getComponent(AudioSource);
      const audioState = this.audioState.get(actor.id);

      if (audioSource.playing && audioState) {
        this.updateAudio(actor);
      }
      if (audioSource.playing && !audioState) {
        this.playAudio(actor);
      }
      if (!audioSource.playing && audioState) {
        this.stopAudio(actor);
      }
    });
  }
}

AudioSystem.systemName = 'AudioSystem';
