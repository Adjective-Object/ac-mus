import { nanoid } from "nanoid";

export type AudioCyclingMode =
  | { type: "solid-loop" }
  | { type: "random-wait"; minWaitMs: number; maxWaitMs: number };
export type AudioSequencingMode = { type: "random" } | { type: "sequential" };

type PlayDuration = {
    fadeInDuration: number;
    fadeOutDuration: number;
    /**
     * A playback duration to use when the browser cannot fetch it
     * (e.g. it is still streaming and is formatted in a way that
     * doesn't have the length in its metadata)
     */
    backupPlayDuration?: number;  
}

type AudioAsset = PlayDuration & {
  url: string;
};

export type AmbienceEntity = {
  audioAssetUrls: [AudioAsset, AudioAsset, ...AudioAsset[]];
  cycleMode: AudioCyclingMode;
  sequenceMode: AudioSequencingMode;
  iconUrl: string;
};

export type AmbienceNode = {
  id: string;
  entity: AmbienceEntity;
  audioSources: AudioSource[];
  panner: StereoPannerNode;
  cleanupAndStopPlayback: () => void;
};

type AudioSource = PlayDuration & {
  element: HTMLAudioElement;
  source: MediaElementAudioSourceNode;
  gain: GainNode;
};

function* infiniteSequence<T>(
  sequenceElements: T[],
  sequenceMode: AudioSequencingMode
) {
  for (let i = 0; true; i++) {
    switch (sequenceMode.type) {
      case "random": {
        yield sequenceElements[
          Math.floor(Math.random() * sequenceElements.length)
        ];
        break;
      }
      case "sequential": {
        yield sequenceElements[i % sequenceElements.length];
        break;
      }
    }
  }
}

function wait(ms: number): Promise<void> {
  return new Promise<void>((res) => {
    setTimeout(() => res(), ms);
  });
}

const TIME_CONST_FRAC = 0.3;

/**
 * Starts playback of the entity against the created audio elements,
 * and returns a cleanup function.
 *
 * @param entity
 * @param htmlAudioElements
 */
function startPlayback(
  entity: AmbienceEntity,
  audioSources: AudioSource[]
): () => void {
  let shouldKeepPlaying: boolean = true;
  let sequence = infiniteSequence(audioSources, entity.sequenceMode);

  (async () => {
    let isFirstIteration = true;

    for (
      let audioSourceIter = sequence.next(), audioSourceIterNext = sequence.next();
      shouldKeepPlaying;
      audioSourceIter = audioSourceIterNext, audioSourceIterNext = sequence.next()
    ) {
      if (audioSourceIter.done || audioSourceIterNext.done) {
        throw new Error("Infinite ambience playback sequence was terminated.");
      }
      const audioSource = audioSourceIter.value;
      const audioNow = audioSource.gain.context.currentTime;

      // fade in this
      if (!isFirstIteration) {
        audioSource.gain.gain.value = 0;
        audioSource.gain.gain.setTargetAtTime(
          1,
          audioNow + audioSource.fadeInDuration,
          audioSource.fadeInDuration * TIME_CONST_FRAC
        );  
      } else {
        audioSource.gain.gain.value = 1;  
      }

      // fade out next
      let duration = audioSource.element.duration;
      if (!Number.isNaN(duration) && Number.isFinite(duration)) {
        audioSource.gain.gain.setTargetAtTime(0, audioNow + duration, audioSource.fadeOutDuration * TIME_CONST_FRAC);
      } else if (audioSource.backupPlayDuration) {
        console.warn(`Duration was NaN or not finite (${duration}), using backup duration of ${audioSource.backupPlayDuration}`);
          duration = audioSource.backupPlayDuration
      } else {
        console.warn(`Duration was NaN or not finite (${duration}), cannot calculate duration`);
      }

      audioSource.element.play();

      // start fading in the next track when this track starts to fade out
      const waitSeconds = duration - audioSource.fadeOutDuration - audioSourceIterNext.value.fadeInDuration;
      await wait(waitSeconds * 1000);

      if (entity.cycleMode.type === "random-wait") {
        // sleep for some time
        await wait(
          Math.random() *
            (entity.cycleMode.maxWaitMs - entity.cycleMode.minWaitMs) +
            entity.cycleMode.minWaitMs
        );
      }

      isFirstIteration = false;
    }
  })();

  return () => {
    audioSources.forEach((source) => source.element.pause());
    shouldKeepPlaying = false;
  };
}

export class AmbienceManager<TEntityId extends string> {
  private _ambienceNodes: Map<string, AmbienceNode> = new Map();
  private _audioContext: AudioContext;
  private _audioHostElement: HTMLElement | undefined;
  private _onNodeAddedCb: ((node: AmbienceNode) => void)[] = [];
  private _onNodeRemovedCb: ((node: AmbienceNode) => void)[] = [];

  constructor(private _knownEntities: Record<TEntityId, AmbienceEntity>) {
    this._audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
  }

  public register(audioHostElement: HTMLElement) {
    this._audioHostElement = audioHostElement;
    console.log("context", this._audioContext);
    this._audioContext.resume();
  }

  public registerAddedORemovedCallback(
    addedCb: (addedNode: AmbienceNode) => void,
    removedCb: (removedNode: AmbienceNode) => void
  ) {
    this._onNodeAddedCb.push(addedCb);
    this._onNodeRemovedCb.push(removedCb);
  }

  public getAvailableEntities(): [TEntityId, AmbienceEntity][] {
    return [...Object.entries(this._knownEntities)] as [
      TEntityId,
      AmbienceEntity
    ][];
  }

  public addAmbienceNode(entityId: TEntityId, initialVolume: number): string {
    const entity = this._knownEntities[entityId];
    if (!entity) {
      throw new Error(
        `tried to add AmbienceNode with unknown entity id: ${entityId}`
      );
    }

    if (!this._audioHostElement) {
      throw new Error(
        "audioHostElement was not defined. Was addEntity() called before register()?"
      );
    }
    const panner = this._audioContext.createStereoPanner();
    const audioSources = entity.audioAssetUrls.map((asset): AudioSource => {
      // create a new audio element and attach it to the panner
      const audio = document.createElement("audio");

      audio.volume = initialVolume;
      audio.src = asset.url;
      this._audioHostElement!.appendChild(audio);
      const source = this._audioContext.createMediaElementSource(audio);
      const gain = this._audioContext.createGain();
      source.connect(gain);
      gain.connect(panner);

      return {
        ...asset,
        element: audio,
        source,
        gain,
      };
    });
    panner.connect(this._audioContext.destination);

    const cleanupAndStopPlayback = startPlayback(entity, audioSources);

    const node: AmbienceNode = {
      id: nanoid(),
      entity: entity,
      audioSources,
      cleanupAndStopPlayback,
      panner,
    };

    this._ambienceNodes.set(node.id, node);
    this._onNodeAddedCb.forEach((cb) => {
      try {
        cb(node);
      } catch (e) {
        setTimeout(() => {
          throw e;
        }, 0);
      }
    });
    return node.id;
  }

  public removeAmbienceNode(nodeId: string): void {
    const nodeToDelete = this._ambienceNodes.get(nodeId);
    if (!nodeToDelete) {
      return;
    }

    for (let source of nodeToDelete.audioSources) {
      this._audioHostElement?.removeChild?.(source.element);
    }
    nodeToDelete.panner.disconnect();

    this._ambienceNodes.delete(nodeId);

    this._onNodeRemovedCb.forEach((cb) => {
      try {
        cb(nodeToDelete);
      } catch (e) {
        setTimeout(() => {
          throw e;
        }, 0);
      }
    });
  }

  public updateAmbienceNodeVolume(nodeId: string, newVolume: number): void {
    const nodeToUpdate = this._ambienceNodes.get(nodeId);
    if (!nodeToUpdate) {
      throw new Error(`Tried to update volume of missing audio node ${nodeId}`);
    }

    for (let source of nodeToUpdate.audioSources) {
      source.element.volume = newVolume;
    }
  }

  public updateAmbienceNodePanning(nodeId: string, newLRPanning: number): void {
    const nodeToUpdate = this._ambienceNodes.get(nodeId);
    if (!nodeToUpdate) {
      throw new Error(`Tried to update volume of missing audio node ${nodeId}`);
    }

    nodeToUpdate.panner.pan.value = newLRPanning;
  }
}
