type Hour = 0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23

const isHour = (hr: number): hr is Hour => {
    return hr >= 0 && hr < 24 && (hr - Math.round(hr) == 0)
}

const nextHour = (hr: Hour) : Hour => {
    return (hr + 1) % 24 as Hour
}

export type HourlyTimeline = Record<Hour, MusicTrack>

export type MusicMeta = {
    title: string,
    bannerUrl: string,
    backgroundStyle: string,
    backgroundTileImgUrl: string,
    blendMode?: 'gray-soft' | 'default' | 'half-visible' | 'transparent-soft'
}

export type MusicTrack = {
    audioUrl: string
    meta: MusicMeta
}

export type CurrentTrackInfo = {
    currentTrack: MusicTrack,
    nextTrack: MusicTrack
}

export class TimelineManager {
    private _callbacks: ((currentTrackInfo: CurrentTrackInfo) => void)[] = []
    private _cancelTimer: undefined | (() => void)

    constructor(private _hourlyTimeline: HourlyTimeline) {
    }

    public getTrackForTime(now: Date): {
        currentTrack: MusicTrack
        nextTrack: MusicTrack
    } {
        const hr = now.getHours()
        if (!isHour(hr)) {
            throw new Error('got illegal hour from date!')
        }
        return {
            currentTrack: this._hourlyTimeline[hr],
            nextTrack: this._hourlyTimeline[nextHour(hr)],
        }
    }

    /**
     * Starts the timer and notifies all listeners of the track at the initial time
     */
    public start(): void {
        const now = new Date();
        this._advanceTrack(now);
    }

    /**
     * Advances the track and notifies all listeners of the current track
     */
     private _advanceTrack(now: Date) {
        const currentTrackInfo = this.getTrackForTime(now)
        for (let cb of this._callbacks) {
            try {
                cb(currentTrackInfo)
            } catch (e) {
                console.error( e instanceof Error ? e.stack : e)
            }
        }

        const hours = now.getHours();
        const nextHour = hours < 23 ? new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            now.getHours() + 1
        ) : new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1,
            0
        );

        console.log('next hour:', nextHour)

        this._cancelTimer = resynchronizingTimer(
            nextHour,
            this._advanceTrack.bind(this, nextHour)
        )
    }

    public stop(): void {
        this._cancelTimer?.();
    }

    public registerTimelineCallback(cb: (currentTrackInfo: CurrentTrackInfo) => void) {
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
        const timeUntilCb = targetTime.getTime() - now.getTime()
        console.log('timeUntilCB:', timeUntilCb, targetTime, now)
        if (timeUntilCb <= 0) {
            cb()
        } else {
            resyncHandle = setTimeout(resyncLoop, Math.min(timeUntilCb, MAX_RESYNC_INTERVAL))
        }
    };

    resyncLoop()

    return () => {
        resyncHandle && clearTimeout(resyncHandle)
    }
}
