import { WorldSystem } from '../../../engine/system';
import type { Scene } from '../../../engine/scene';
import type { World } from '../../../engine/world';
import type { WorldSystemOptions } from '../../../engine/system';
import type { TemplateCollection } from '../../../engine/template';
import { Actor, ActorQuery } from '../../../engine/actor';
import { AddActor, RemoveActor } from '../../../engine/events';
import type { AddActorEvent, RemoveActorEvent } from '../../../engine/events';
import { CacheStore } from '../../../engine/data-lib';
import { AudioSource } from '../../components';
import { PlayAudio, StopAudio, SetAudioVolume } from '../../../events';
import type {
  SetAudioGroupVolumeEvent,
  SetAudioSourceVolumeEvent,
} from '../../../events';
import type { ActorEvent } from '../../../types/events';

import type { AudioGroups, AudioStateNode } from './types';
import { getAllSources, loadAudio } from './utils';

const MASTER_GROUP = 'master';
const VOLUME_TOLERANCE = 0.001;

/**
 * Audio system that manages audio playback for actors with {@link AudioSource} components
 *
 * @extends WorldSystem
 * 
 * @category Systems
 */
export class AudioSystem extends WorldSystem {
  private templateCollection: TemplateCollection;
  private world: World;

  private audioContext: AudioContext;
  private audioGroups: Record<string, GainNode | undefined>;
  private audioStore: CacheStore<AudioBuffer>;
  private audioState: Map<string, AudioStateNode>;
  private actorQuery?: ActorQuery;

  constructor(options: WorldSystemOptions) {
    super();

    const { world, globalOptions, templateCollection } = options;

    this.templateCollection = templateCollection;
    this.world = world;

    this.audioContext = new AudioContext();

    const masterAudioGroup = new GainNode(this.audioContext);

    masterAudioGroup.connect(this.audioContext.destination);

    const audioGroupsOption = globalOptions.audioGroups as
      | AudioGroups
      | undefined;
    const audioGroupsSettings = audioGroupsOption?.groups ?? [];
    this.audioGroups = audioGroupsSettings.reduce(
      (acc, groupSettings) => {
        if (groupSettings.name === MASTER_GROUP) {
          return acc;
        }

        const gainNode = new GainNode(this.audioContext);
        gainNode.gain.value = groupSettings.volume;

        gainNode.connect(masterAudioGroup);

        acc[groupSettings.name] = gainNode;
        return acc;
      },
      { [MASTER_GROUP]: masterAudioGroup } as Record<
        string,
        GainNode | undefined
      >,
    );

    this.audioStore = new CacheStore<AudioBuffer>();
    this.audioState = new Map();

    this.world.addEventListener(PlayAudio, this.handlePlayAudio);
    this.world.addEventListener(StopAudio, this.handleStopAudio);
    this.world.addEventListener(SetAudioVolume, this.handleSetAudioVolume);

    window.addEventListener('click', this.resumeIfSuspended, { once: true });
    window.addEventListener('keydown', this.resumeIfSuspended, { once: true });
    window.addEventListener('touchstart', this.resumeIfSuspended, {
      once: true,
    });
  }

  async onSceneLoad(scene: Scene): Promise<void> {
    const allSources = [
      ...getAllSources(this.templateCollection.getAll()),
      ...getAllSources(scene.children),
    ];
    const uniqueSources = [...new Set(allSources)];

    const audioBuffers = await Promise.all(
      uniqueSources.map((src) => {
        return !this.audioStore.has(src) ? this.loadAudio(src) : undefined;
      }),
    );

    uniqueSources.forEach((src, index) => {
      if (audioBuffers[index]) {
        this.audioStore.add(src, audioBuffers[index]!);
      }
    });
    allSources.forEach((src) => this.audioStore.retain(src));
  }

  onSceneEnter(scene: Scene): void {
    this.actorQuery = new ActorQuery({
      scene,
      filter: [AudioSource],
    });

    this.actorQuery.getActors().forEach((actor) => this.initAudio(actor));

    this.actorQuery.addEventListener(AddActor, this.handleActorAdd);
    this.actorQuery.addEventListener(RemoveActor, this.handleActorRemove);
  }

  onSceneExit(): void {
    this.audioState.forEach((audioState) => {
      audioState.sourceNode.stop();
    });

    this.actorQuery?.removeEventListener(AddActor, this.handleActorAdd);
    this.actorQuery?.removeEventListener(RemoveActor, this.handleActorRemove);

    this.actorQuery = undefined;
  }

  onSceneDestroy(scene: Scene): void {
    const allSources = [
      ...getAllSources(this.templateCollection.getAll()),
      ...getAllSources(scene.children),
    ];

    allSources.forEach((src) => this.audioStore.release(src));
    this.audioStore.cleanReleased();
  }

  onWorldDestroy(): void {
    void this.audioContext.close();

    this.world.removeEventListener(PlayAudio, this.handlePlayAudio);
    this.world.removeEventListener(StopAudio, this.handleStopAudio);
    this.world.removeEventListener(SetAudioVolume, this.handleSetAudioVolume);

    window.removeEventListener('click', this.resumeIfSuspended);
    window.removeEventListener('keydown', this.resumeIfSuspended);
    window.removeEventListener('touchstart', this.resumeIfSuspended);
  }

  private async loadAudio(src: string): Promise<AudioBuffer | undefined> {
    if (!src) {
      return undefined;
    }

    try {
      const arrayBuffer = await loadAudio(src);
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      return audioBuffer;
    } catch (error: unknown) {
      console.error(
        `An error occurred during audio source loading: ${src}`,
        error,
      );
      return undefined;
    }
  }

  private handleActorAdd = (event: AddActorEvent): void => {
    const { actor } = event;

    const { src } = actor.getComponent(AudioSource);
    this.audioStore.retain(src);

    this.initAudio(actor);
  };

  private handleActorRemove = (event: RemoveActorEvent): void => {
    const { actor } = event;

    const { src } = actor.getComponent(AudioSource);
    this.audioStore.release(src);

    this.stopAudio(actor);
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
      const audioGroup =
        this.audioGroups[(event as SetAudioGroupVolumeEvent).group];

      if (!audioGroup) {
        return;
      }

      audioGroup.gain.value = event.value;
    }
  };

  private resumeIfSuspended = (): void => {
    if (this.audioContext.state === 'suspended') {
      void this.audioContext.resume().catch((err: unknown) => {
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

    const { src, group, volume, looped, playing } = audioSource;
    const audioGroupNode = this.audioGroups[group];

    if (!audioGroupNode || !this.audioStore.has(src)) {
      return;
    }

    if (playing && this.audioState.has(actor.id)) {
      const prevAudio = this.audioState.get(actor.id)!;
      prevAudio.sourceNode.removeEventListener(
        'ended',
        prevAudio.properties.endedListener,
      );
      prevAudio.sourceNode.stop();
      prevAudio.gainNode.disconnect();
    }

    const sourceNode = new AudioBufferSourceNode(this.audioContext, {
      buffer: this.audioStore.get(src),
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
    const audioSource = actor.getComponent(AudioSource) as
      | AudioSource
      | undefined;

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

    if (
      Math.abs(audioSource.volume - audioState.properties.volume) >
      VOLUME_TOLERANCE
    ) {
      audioState.gainNode.gain.value = audioSource.volume;
    }
  }

  update(): void {
    this.actorQuery?.getActors().forEach((actor) => {
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
