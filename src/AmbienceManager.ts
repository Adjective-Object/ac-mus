import { nanoid } from "nanoid";

export type AudioCyclingMode =
  | { type: "solid-loop" }
  | { type: "random-wait"; minWaitSeconds: number; maxWaitSeconds: number };
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
  name: string,
  audioAssets: [AudioAsset, ...AudioAsset[]];
  cycleMode: AudioCyclingMode;
  sequenceMode: AudioSequencingMode;
  iconUrl: string;
  gainCap?: number;
  maxStartTimeOffset?: number;
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
  crossFadeGain: GainNode;
  volumeGain: GainNode;
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
export const DEFAULT_GAIN_CAP = 2;

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
      const audioNow = audioSource.crossFadeGain.context.currentTime;
      // apply random offset to start time so that when the same sample
      // is on 2 different tracks, it doesn't double-up in unpleasant ways.
      const startTimeOffset = Math.random() * (entity.maxStartTimeOffset ?? 2);

      // fade in this
      if (!isFirstIteration) {
        audioSource.crossFadeGain.gain.value = 0;
        audioSource.crossFadeGain.gain.setTargetAtTime(
          1,
          audioNow + audioSource.fadeInDuration,
          audioSource.fadeInDuration * TIME_CONST_FRAC
        );  
      } else {
        audioSource.crossFadeGain.gain.value = 1;  
      }

      // fade out next
      let duration = audioSource.element.duration;
      if (!Number.isNaN(duration) && Number.isFinite(duration)) {
        if (audioSource.backupPlayDuration !== undefined && Math.abs(duration - audioSource.backupPlayDuration) > 0.01) {
          console.warn(`Mismatched backup play duration: ${audioSource.element.src} had backup duration ${audioSource.backupPlayDuration} but actual was ${duration}`)
        }
        
        audioSource.crossFadeGain.gain.setTargetAtTime(0, audioNow + duration - startTimeOffset, audioSource.fadeOutDuration * TIME_CONST_FRAC);
      } else if (audioSource.backupPlayDuration) {
        console.warn(`Duration was NaN or not finite (${duration}), using backup duration of ${audioSource.backupPlayDuration}`);
          duration = audioSource.backupPlayDuration
      } else {
        console.warn(`Duration was NaN or not finite (${duration}), cannot calculate duration`);
      }

      audioSource.element.currentTime = startTimeOffset;
      audioSource.element.play();

      // start fading in the next track when this track starts to fade out
      const waitSeconds = duration - audioSource.fadeOutDuration - audioSourceIterNext.value.fadeInDuration - startTimeOffset;
      await wait(waitSeconds * 1000);

      if (entity.cycleMode.type === "random-wait") {
        // sleep for some time
        await wait(
          Math.random() *
            (entity.cycleMode.maxWaitSeconds - entity.cycleMode.minWaitSeconds) +
            entity.cycleMode.minWaitSeconds
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
  private _onBeforeNodeAddedCb: ((entity: AmbienceEntity) => void)[] = [];
  private _onNodeAddedCb: ((node: AmbienceNode) => void)[] = [];
  private _onNodeRemovedCb: ((node: AmbienceNode) => void)[] = [];
  private _analyserNode?: AnalyserNode;

  constructor(private _knownEntities: Record<TEntityId, AmbienceEntity>) {
    this._audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)({
        latencyHint: 'playback'
      });
    
      console.log('baseLatency', this._audioContext.baseLatency, this._audioContext)
  }

  public register(audioHostElement: HTMLElement) {
    this._audioHostElement = audioHostElement;
    console.log("context", this._audioContext);
  }
  
  public insertAnalyser(): AnalyserNode {
    if (!this._audioContext) {
      throw new Error(`No _audioContext, insertAnalyser called before register()?`)
    }

    if (this._ambienceNodes.size) {
      throw new Error('Called insertAnalyser after adding ambience')
    }

    this._analyserNode = this._audioContext.createAnalyser()
    return this._analyserNode;
  }

  public registerAddedORemovedCallback(
    addedCb: (addedNode: AmbienceNode) => void,
    removedCb: (removedNode: AmbienceNode) => void
  ) {
    this._onNodeAddedCb.push(addedCb);
    this._onNodeRemovedCb.push(removedCb);
  }

  public registerOnBeforeNodeAddedCallback(
    onBeforeAddedCb: (entity: AmbienceEntity) => void,
  ) {
    this._onBeforeNodeAddedCb.push(onBeforeAddedCb);
  }

  public isPlaying(): boolean {
    return this._ambienceNodes.size !== 0;
  }

  public getAvailableEntities(): [TEntityId, AmbienceEntity][] {
    return [...Object.entries(this._knownEntities)] as [
      TEntityId,
      AmbienceEntity
    ][];
  }

  public addAmbienceNode(entityId: TEntityId, initialVolumePercent: number, initialPan = 0): string {
    // start the audiocontext if it is frozen
    if (this._audioContext.state === "suspended") {
      this._audioContext.resume();
    }

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

    for(let cb of this._onBeforeNodeAddedCb) {
      cb(entity);
    }

    const panner = this._audioContext.createStereoPanner();
    panner.pan.value = initialPan;
    const audioAssetsRepeated = [
      ...entity.audioAssets,
      ...entity.audioAssets
    ]

    const audioSources = audioAssetsRepeated.map((asset): AudioSource => {
      // create a new audio element and attach it to the panner
      const audio = document.createElement("audio");

      audio.volume = 1;
      audio.src = asset.url;
      this._audioHostElement!.appendChild(audio);
      const source = this._audioContext.createMediaElementSource(audio);
      const crossFadeGain = this._audioContext.createGain();
      const volumeGain = this._audioContext.createGain();
      source.connect(volumeGain);
      volumeGain.connect(crossFadeGain)
      volumeGain.gain.value = initialVolumePercent * (entity.gainCap ?? DEFAULT_GAIN_CAP);
      crossFadeGain.connect(panner);
      crossFadeGain.gain.value = 1;
      
      return {
        ...asset,
        element: audio,
        source,
        crossFadeGain: crossFadeGain,
        volumeGain: volumeGain
      };
    });

    if (this._analyserNode) {
      panner.connect(this._analyserNode);
    }
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

    nodeToDelete.cleanupAndStopPlayback();

    for (let source of nodeToDelete.audioSources) {
      source.volumeGain.disconnect();
      source.crossFadeGain.disconnect();
      source.source.disconnect();
    }
    nodeToDelete.panner.disconnect();

    for (let source of nodeToDelete.audioSources) {
      source.element.pause()
      source.element.onended = null;
      this._audioHostElement?.removeChild?.(source.element);
    }

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

    if (this._ambienceNodes.size === 0) {
      setTimeout(() => {
        if (this._ambienceNodes.size === 0) {
          this._audioContext.suspend();
        }
      }, 1000)
    }
  }

  public updateAmbienceNodeVolume(nodeId: string, newVolume: number): void {
    const nodeToUpdate = this._ambienceNodes.get(nodeId);
    if (!nodeToUpdate) {
      throw new Error(`Tried to update volume of missing audio node ${nodeId}`);
    }

    for (let source of nodeToUpdate.audioSources) {
      source.volumeGain.gain.value = newVolume;
    }
  }

  public getAmbienceNodeVolume(nodeId: string): number {
    const node = this._ambienceNodes.get(nodeId);
    if (!node) {
      throw new Error(`Could not get volume of unknown node ${nodeId}`);
    }

    return node.audioSources[0].volumeGain.gain.value;
  }


  public getAmbienceNodePan(nodeId: string): number {
    const node = this._ambienceNodes.get(nodeId);
    if (!node) {
      throw new Error(`Could not get LR pan of unknown node ${nodeId}`);
    }

    return node.panner.pan.value;
  }


  public updateAmbienceNodePanning(nodeId: string, newLRPanning: number): void {
    const nodeToUpdate = this._ambienceNodes.get(nodeId);
    if (!nodeToUpdate) {
      throw new Error(`Tried to update volume of missing audio node ${nodeId}`);
    }

    nodeToUpdate.panner.pan.value = newLRPanning;
  }

  public randomizeAmbienceNodes(numNodes: number = 5) {
    for (let nodeId of [...this._ambienceNodes.keys()]) {
      this.removeAmbienceNode(nodeId)
    }
    const knownEntityKeys = this.getAvailableEntities().map(([a]) => a)
    for (let i = 0; i < numNodes; i++) {
      const newNodeEntityId = knownEntityKeys[Math.floor(Math.random() * knownEntityKeys.length)];

      this.addAmbienceNode(
        newNodeEntityId,
        0.2 + Math.random() * 0.5 * Math.pow(0.85, numNodes), // volume
        Math.max(-1, Math.min(1, Math.random() - Math.random())) // panning
      )
    }
  }
}
