type VolumeChangedCallback = (volume: number) => void;

const VOLUME_CLASS_KEYBOARD_TIMEOUT = 800;
export class VolumeSlider {
    private _volumeListeners: VolumeChangedCallback[] = [];
    private _volumeRangeElement: HTMLInputElement | undefined;
    private _volumeContainerElement: HTMLElement | undefined;
    private _volumeClearTimeout: undefined | number;

    constructor(private _volume: number) {
    }

    public register(
        volumeRangeElement: HTMLInputElement,
        volumeContainerElement: HTMLElement,
    ) {
        this._volumeRangeElement = volumeRangeElement
        this._volumeContainerElement = volumeContainerElement
        this._volumeRangeElement.valueAsNumber = this._volume;
        this._notifyVolumeChanged();
        this._volumeRangeElement.addEventListener('input', () => {
            if (!this._volumeRangeElement) {
                throw new Error('this._volumeRangeElement became unbound')
            }
            this._volume = this._volumeRangeElement.valueAsNumber;
            this._notifyVolumeChanged()
        })
    }

    private _notifyVolumeChanged() {
        for (let cb of this._volumeListeners) {
            try {
                cb(this._volume)
            } catch (e) {
                setTimeout(() => {throw e}, 0)
            }
        }
    }

    public registerVolumeChangedCallback(onVolumeChanged: VolumeChangedCallback) {
        this._volumeListeners.push(onVolumeChanged)
    }

    public addVolume(offset: number) {
        this._volume = Math.min(1, Math.max(0, this._volume + offset));
        this._updateUI();
        this._notifyVolumeChanged()
    }

    private _updateUI() {
        if (this._volumeRangeElement) {
            this._volumeRangeElement.valueAsNumber = this._volume;
        }
        if (this._volumeContainerElement) {
            const x = this._volumeContainerElement
            x.classList.add('auto-updated')
            if (this._volumeClearTimeout) {
                clearTimeout(this._volumeClearTimeout)
            }
            this._volumeClearTimeout = setTimeout(() => {
                x.classList.remove('auto-updated')
            }, VOLUME_CLASS_KEYBOARD_TIMEOUT)
        }
    }
}