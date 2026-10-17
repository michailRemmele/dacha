import { WorldSystem } from '../../../engine/system';
import { DefineSystem } from '../../../engine/decorators';
import type { Scene } from '../../../engine/scene';
import type { World } from '../../../engine/world';
import type { WorldSystemOptions } from '../../../engine/system';
import type { Assets } from '../../../engine/asset';
import { Actor, ActorQuery } from '../../../engine/actor';
import { AddActor, RemoveActor } from '../../../engine/events';
import type { AddActorEvent, RemoveActorEvent } from '../../../engine/events';
import { AudioSource } from '../../components';
import { Audio } from '../../assets';

import { AudioAPI } from './api';
import type { AudioGroups, AudioStateNode } from './types';

const MASTER_GROUP = 'master';
const VOLUME_TOLERANCE = 0.001;

/**
 * Plays the sounds of actors that have an {@link AudioSource} component.
 *
 * The system registers {@link AudioAPI} in `world.systemApi`. Use it to read and change
 * the volume of audio groups. The global option `audioGroups` sets the groups and their
 * start volume.
 *
 * Put `AudioSystem` after the systems that call {@link AudioSource.play} and
 * {@link AudioSource.stop}. If behaviors play sounds, that includes {@link BehaviorSystem}.
 *
 * @see [Audio](https://dachajs.org/systems/audio/)
 *
 * @category Audio
 */
@DefineSystem({ name: 'AudioSystem', icon: 'Volume' })
export class AudioSystem extends WorldSystem {
  private assets: Assets;
  private world: World;

  private audioContext: AudioContext;
  private audioGroups: Record<string, GainNode | undefined>;
  private audioState: Map<string, AudioStateNode>;
  private actorQuery?: ActorQuery;

  constructor(options: WorldSystemOptions) {
    super();

    const { world, globalOptions, assets } = options;

    this.assets = assets;
    this.world = world;

    this.audioContext = new AudioContext();

    const masterAudioGroup = new GainNode(this.audioContext);

    masterAudioGroup.connect(this.audioContext.destination);

    const audioGroupsOption = globalOptions.audioGroups as
      AudioGroups | undefined;
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

    this.audioState = new Map();

    const audioApi = new AudioAPI({
      getGroupVolume: (group): number => this.getGroupVolume(group),
      setGroupVolume: (group, volume): void => {
        this.setGroupVolume(group, volume);
      },
    });
    this.world.systemApi.register(audioApi);

    window.addEventListener('click', this.resumeIfSuspended, { once: true });
    window.addEventListener('keydown', this.resumeIfSuspended, { once: true });
    window.addEventListener('touchstart', this.resumeIfSuspended, {
      once: true,
    });
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

  onWorldDestroy(): void {
    void this.audioContext.close();

    window.removeEventListener('click', this.resumeIfSuspended);
    window.removeEventListener('keydown', this.resumeIfSuspended);
    window.removeEventListener('touchstart', this.resumeIfSuspended);
  }

  private handleActorAdd = (event: AddActorEvent): void => {
    const { actor } = event;

    this.initAudio(actor);
  };

  private handleActorRemove = (event: RemoveActorEvent): void => {
    const { actor } = event;

    this.stopAudio(actor);
  };

  private resumeIfSuspended = (): void => {
    if (this.audioContext.state === 'suspended') {
      void this.audioContext.resume().catch((err: unknown) => {
        console.warn('Cannot resume a audio context', err);
      });
    }
  };

  private getGroup(group: string): GainNode {
    const audioGroup = this.audioGroups[group];

    if (!audioGroup) {
      throw new Error(
        `Can't find audio group with the following name: ${group}`,
      );
    }

    return audioGroup;
  }

  private getGroupVolume(group: string): number {
    return this.getGroup(group).gain.value;
  }

  private setGroupVolume(group: string, volume: number): void {
    this.getGroup(group).gain.value = volume;
  }

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

    const { audio, group, volume, looped, _playing: playing } = audioSource;
    const audioGroupNode = this.audioGroups[group];
    const audioAsset = this.assets.get(Audio, audio);
    if (audioAsset && !audioAsset.resource) {
      void audioAsset.load();
    }
    const buffer = audioAsset?.resource;

    if (!audioGroupNode || !buffer) {
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
      buffer,
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
    audioSource._playing = true;
    audioSource._restarting = false;
  }

  private stopAudio(actor: Actor): void {
    const audioSource = actor.getComponent(AudioSource) as
      AudioSource | undefined;

    if (audioSource) {
      audioSource._playing = false;
      audioSource._restarting = false;
    }

    const audioState = this.audioState.get(actor.id);

    if (!audioState) {
      return;
    }

    audioState.sourceNode.removeEventListener(
      'ended',
      audioState.properties.endedListener,
    );
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
      audioState.properties.volume = audioSource.volume;
    }
  }

  update(): void {
    this.actorQuery?.getActors().forEach((actor) => {
      const audioSource = actor.getComponent(AudioSource);
      const audioState = this.audioState.get(actor.id);

      if (audioSource._playing && audioState && audioSource._restarting) {
        this.playAudio(actor);
        return;
      }

      if (audioSource._playing && audioState) {
        this.updateAudio(actor);
      }
      if (audioSource._playing && !audioState) {
        this.playAudio(actor);
      }
      if (!audioSource._playing && audioState) {
        this.stopAudio(actor);
      }
    });
  }
}

export { AudioAPI } from './api';
