import { CurrentTrackInfo, TimelineManager } from "./TimelineManager";
import { VolumeSlider } from "./VolumeSlider";

export class AudioPlayer {
  private _currentAudioElement: undefined | HTMLAudioElement;
  private _preloadAudioElement: undefined | HTMLAudioElement;
  private _isPlaying: boolean = false;
  private _playPauseCallbacks: ((isPlaying: boolean) => void)[] = []
  public get isPlaying() {
    return this._isPlaying;
  }

  constructor(
    private _timelineManager: TimelineManager,
    private _volumeSlider: VolumeSlider
  ) {}

  /**
   * Install the audio elements we playback with
   */
  public register(targetElement: HTMLElement): void {
    this._currentAudioElement = document.createElement("audio");
    this._preloadAudioElement = document.createElement("audio");
    this._currentAudioElement.loop = true;
    this._preloadAudioElement.loop = true;
    targetElement.appendChild(this._currentAudioElement);
    targetElement.appendChild(this._preloadAudioElement);

    this._currentAudioElement.addEventListener(
      "canplay",
      this._startPlaybackIfCurrent.bind(this)
    );
    this._preloadAudioElement.addEventListener(
      "canplay",
      this._startPlaybackIfCurrent.bind(this)
    );


    this._currentAudioElement.addEventListener(
        "pause",
        this._pausePlaybackIfCurrent.bind(this)
      );
      this._preloadAudioElement.addEventListener(
        "pause",
        this._pausePlaybackIfCurrent.bind(this)
      );
  

    this._timelineManager.registerTimelineCallback(
      this._onTrackUpdated.bind(this)
    );
    this._volumeSlider.registerVolumeChangedCallback(
      this._onVolumeUpdated.bind(this)
    );
  }

  private _startPlaybackIfCurrent(e: Event) {
    if (e.target === this._currentAudioElement && this._isPlaying) {
      this._currentAudioElement.play();
    }
  }

  private _pausePlaybackIfCurrent(e: Event) {
    if (e.target === this._currentAudioElement && this._isPlaying) {
        this._isPlaying = false;
        this._onPlayPause();
    }
  }


  public play(): void {
    this._isPlaying = true;
    const now = new Date();
    this._onTrackUpdated(this._timelineManager.getTrackForTime(now));
    this._onPlayPause();
  }

  private _onVolumeUpdated(newVolume: number) {
    if (this._currentAudioElement && this._preloadAudioElement) {
      this._currentAudioElement.volume = newVolume;
      this._preloadAudioElement.volume = newVolume;
    } else {
      throw new Error(
        "AudioPlayer._onVolumeUpdated called before registration?"
      );
    }
  }

  private _onTrackUpdated({ currentTrack, nextTrack }: CurrentTrackInfo): void {
    if (!this._currentAudioElement || !this._preloadAudioElement) {
      throw new Error(
        "_onTrackUpdated() was called before audio elements were initialized"
      );
    }

    if (
      currentTrack.audioUrl === this._currentAudioElement.src &&
      nextTrack.audioUrl === this._preloadAudioElement.src
    ) {
      // noop, no updates to perform
      return;
    } else if (!this.isPlaying) {
      // if we are not playing, do nothing
    } else {
      // Load the track and next track into the audio elements
      if (this._preloadAudioElement.src === currentTrack.audioUrl) {
        // If the current track is preloaded, swap the preload
        // and current audio players
        const tmp = this._currentAudioElement;
        this._currentAudioElement = this._preloadAudioElement;
        this._preloadAudioElement = tmp;
        // stop playback for the preload element
        this._preloadAudioElement.pause();
      } else {
        // otherwise, just load the current track
        this._currentAudioElement.src = currentTrack.audioUrl;
      }
      this._preloadAudioElement.src = nextTrack.audioUrl;
    }
  }

  public pause(): void {
    this._isPlaying = false;
    this._currentAudioElement?.pause();
    this._preloadAudioElement?.pause();
    this._onPlayPause();
  }

  public registerPlayPauseCallback(cb: (isPlaying: boolean) => void) {
      this._playPauseCallbacks.push(cb)
  }

  private _onPlayPause() {
    for (let cb of this._playPauseCallbacks) {
        try {
            cb(this.isPlaying)
        } catch (e) {
            setTimeout(() => {throw e}, 0)
        }
    }

  }
}
