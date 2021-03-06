export type Hour =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23;

export const isHour = (hr: number): hr is Hour => {
  return hr >= 0 && hr < 24 && hr - Math.round(hr) == 0;
};

export const addHour = (hr: Hour, offset: number = 1): Hour => {
  return ((hr + 24 + offset) % 24) as Hour;
};

export type HourlyTimeline = Record<Hour, MusicTrack>;

export type Artist = {
  name: string;
  profileUrl: string;
};

export type MusicMeta = {
  title: string;
  bannerUrl: string;
  backgroundStyle: string;
  backgroundTileImgUrl: string;
  blendMode?:
    | "gray-soft"
    | "default"
    | "half-visible"
    | "transparent-soft"
    | "exclusion"
    | "dodgerot"
    | "funky";
  darkLight?: "dark" | "light";
  by?: Artist[];
};

export type MusicTrack = {
  audioUrl: string;
  meta: MusicMeta;
};

export type ActiveMusicTrack = MusicTrack & { timelinePosition: Hour };

export type CurrentTrackInfo = {
  previousTrack: ActiveMusicTrack;
  currentTrack: ActiveMusicTrack;
  nextTrack: ActiveMusicTrack;
};

const normalizeHourlyTimeline = (timeline: HourlyTimeline): HourlyTimeline => {
  const sanitizedTimeline: HourlyTimeline = { ...timeline };
  const pageUrl = new URL(window.location.toString());
  for (let k of Object.keys(sanitizedTimeline)
    .map((x) => Number(x))
    .filter(isHour)) {
    const unsanitizedEntry = timeline[k];
    sanitizedTimeline[k] = {
      ...unsanitizedEntry,
      audioUrl: new URL(unsanitizedEntry.audioUrl, pageUrl).toString(),
    };
  }

  return sanitizedTimeline;
};

export class TimelineManager {
  private _callbacks: ((currentTrackInfo: CurrentTrackInfo) => void)[] = [];
  private _cancelTimer: undefined | (() => void);
  private _hourOffset: number = 0;
  private _minutesPeriod: number = 60;
  private _hourlyTimeline: HourlyTimeline;

  constructor(hourlyTimeline: HourlyTimeline) {
    this._hourlyTimeline = normalizeHourlyTimeline(hourlyTimeline);
  }

  public get hourOffset() {
    return this._hourOffset;
  }

  public setMinutePeriod(period: number) {
    // HACK: ensure the current track and intended track align
    // at time of setting by getting the track before and after
    // updating minutesPeriod, and then applying the difference
    // to the track offset.
    const now = new Date();
    const priorPosition = this._getTimelinePositionForDate(now)
    this._minutesPeriod = Math.max(1, Math.min(60, period));
    const afterPosition = this._getTimelinePositionForDate(now)
    this._hourOffset += priorPosition - afterPosition;

    // call this because it will also cancel any pending timeout
    // and schedule a new one.
    this._updateTrackForTime(now);
  }

  public setHourOffset(offset: number) {
    this._hourOffset = offset;
    this._updateTrackForTime(new Date());
  }


  private _getTimelinePositionForDate(now: Date): Hour {
    const hr = Math.floor((now.getHours() * 60 + now.getMinutes()) / this._minutesPeriod) % 24
    if (!isHour(hr)) {
      throw new Error("got illegal hour from date!");
    }
    return addHour(hr, this._hourOffset);
  }

  public getTrackForTime(now: Date): CurrentTrackInfo {
    const hrWithOffset = this._getTimelinePositionForDate(now);
    return {
      previousTrack: this._getFromHourlyTimeline(hrWithOffset, -1),
      currentTrack: this._getFromHourlyTimeline(hrWithOffset, 0),
      nextTrack: this._getFromHourlyTimeline(hrWithOffset, 1),
    };
  }

  private _getFromHourlyTimeline(
    hr: Hour,
    offset: number
  ): MusicTrack & { timelinePosition: Hour } {
    const offsetHr = addHour(hr, offset);
    return {
      ...this._hourlyTimeline[offsetHr],
      timelinePosition: offsetHr,
    };
  }

  /**
   * Starts the timer and notifies all listeners of the track at the initial time
   */
  public start(): void {
    const now = new Date();
    this._updateTrackForTime(now);
  }

  /**
   * Advances the track and notifies all listeners of the current track
   */
  private _updateTrackForTime(now: Date) {
    const currentTrackInfo = this.getTrackForTime(now);
    for (let cb of this._callbacks) {
      try {
        cb(currentTrackInfo);
      } catch (e) {
        setTimeout(() => {
          throw e;
        }, 0);
      }
    }

    const nextHour = nextTimeOnPeriod(now, this._minutesPeriod)

    // clear any existing timeout
    this._cancelAndClearPendingTimeout()
    this._cancelTimer = resynchronizingTimer(
      nextHour,
      this._updateTrackForTime.bind(this, nextHour)
    );
  }

  public stop(): void {
    this._cancelAndClearPendingTimeout()
  }

  private _cancelAndClearPendingTimeout() {
    if (this._cancelTimer) {
      this._cancelTimer();
      this._cancelTimer = undefined;
    }
  }

  public registerTimelineCallback(
    cb: (currentTrackInfo: CurrentTrackInfo) => void
  ) {
    this._callbacks.push(cb);
  }
}

// 60 second interval
const MAX_RESYNC_INTERVAL = 60 * 1000;

/**
 * Periodically sets timeouts until the target time, at which point it calls the callback.
 *
 * @returns a callback to cancel the timer.
 */
function resynchronizingTimer(targetTime: Date, cb: () => void): () => void {
  let resyncHandle: number | null = null;

  function resyncLoop() {
    var now = new Date();
    const timeUntilCb = targetTime.getTime() - now.getTime();
    if (timeUntilCb <= 0) {
      cb();
    } else {
      resyncHandle = setTimeout(
        resyncLoop,
        Math.min(timeUntilCb, MAX_RESYNC_INTERVAL)
      );
    }
  }

  resyncLoop();

  return () => {
    resyncHandle && clearTimeout(resyncHandle);
  };
}

function nextTimeOnPeriod(baseDate: Date, periodMinutes: number) {
  const nextPeriodStartMinutes = Math.floor((baseDate.getMinutes() / periodMinutes + 1)) * periodMinutes;
  return new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    baseDate.getHours(),
     // if this is over 60, the Date constructor automatically
     // rolls it over to the next hour
    nextPeriodStartMinutes
  )
}