import { CurrentTrackInfo, TimelineManager } from "./TimelineManager";
import { VolumeSlider } from "./VolumeSlider";

export class AudioPlayer {
  private _currentAudioElement: undefined | HTMLAudioElement;
  private _preloadAudioElement: undefined | HTMLAudioElement;
  private _bellChimeAudioElement: undefined | HTMLAudioElement;
  private _isBellChimeEnabled: boolean = false;
  private _isWaitingForBell: boolean = false;
  private _isPlaying: boolean = false;
  private _playPauseCallbacks: ((isPlaying: boolean) => void)[] = []
  public get isPlaying() {
    return this._isPlaying;
  }

  constructor(
    private _bellChimeUrl: string,
    private _timelineManager: TimelineManager,
    private _volumeSlider: VolumeSlider
  ) {}

  /**
   * Install the audio elements we playback with
   */
  public register(targetElement: HTMLElement): void {
    this._bellChimeAudioElement = document.createElement("audio");
    this._currentAudioElement = document.createElement("audio");
    this._preloadAudioElement = document.createElement("audio");
    this._bellChimeAudioElement.src = this._bellChimeUrl;
    this._bellChimeAudioElement.loop = false;
    this._currentAudioElement.loop = true;
    this._preloadAudioElement.loop = true;
    this._bellChimeAudioElement.preload = 'auto';
    this._currentAudioElement.preload = 'auto';
    this._preloadAudioElement.preload = 'auto';
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
    if (e.target === this._currentAudioElement && this._isPlaying && !this._isWaitingForBell) {
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
    if (this._currentAudioElement && this._preloadAudioElement && this._bellChimeAudioElement) {
      this._currentAudioElement.volume = newVolume;
      this._preloadAudioElement.volume = newVolume;
      this._bellChimeAudioElement.volume = newVolume;
    } else {
      throw new Error(
        "AudioPlayer._onVolumeUpdated called before registration?"
      );
    }
  }

  private _onTrackUpdated(trackInfo: CurrentTrackInfo): void {
    if (!this._currentAudioElement || !this._preloadAudioElement) {
      throw new Error(
        "_onTrackUpdated() was called before audio elements were initialized"
      );
    }

    this._readyTracksForPlayback(trackInfo);

    // stop playback for the preload element
    this._preloadAudioElement.pause();

    if (this._isPlaying && this._isBellChimeEnabled && this._bellChimeAudioElement) {
      // stop playback for the active element and play the bell.
      this._currentAudioElement.pause();

      const bellChime = this._bellChimeAudioElement;
      bellChime.currentTime = 0;
      this._isWaitingForBell = true;
      bellChime.play();
      this._bellChimeAudioElement.addEventListener('ended', this._onBellDone)
    } else {
      this._playIfPlaying();
    }
  }

  private _onBellDone = () => {
    this._playIfPlaying();
    this._bellChimeAudioElement?.removeEventListener('ended', this._onBellDone)
  }

  private _playIfPlaying() {
    if (this._isPlaying) {
      // start playback for the playing element
      this._currentAudioElement?.play();      
    } else {
      // start playback for the playing element
      this._currentAudioElement?.pause();
    }
  }

  private _readyTracksForPlayback({ currentTrack, nextTrack }: CurrentTrackInfo): void {
    if (!this._currentAudioElement || !this._preloadAudioElement) {
      throw new Error(
        "_readyTracksForPlayback() was called before audio elements were initialized"
      );
    }

    if (
      currentTrack.audioUrl === this._currentAudioElement.src &&
      nextTrack.audioUrl === this._preloadAudioElement.src
    ) {
      // noop, no updates to perform
      return;
    } else {
      // Load the track and next track into the audio elements
      if (this._preloadAudioElement.src === currentTrack.audioUrl) {
        // If the current track is preloaded, swap the preload
        // and current audio players
        const tmp = this._currentAudioElement;
        this._currentAudioElement = this._preloadAudioElement;
        this._preloadAudioElement = tmp;
      } else {
        // otherwise, just load the current track and preload the next track
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

  public get isBellChimeEnabled() {
    return this._isBellChimeEnabled;
  }

  public setBellChimeEnabled(isBellChimeEnabled: boolean) {
    if (!isBellChimeEnabled && this._isWaitingForBell) {
      this._bellChimeAudioElement?.pause()
      this._onBellDone()
    }
    this._isBellChimeEnabled = isBellChimeEnabled;
  }
}
