type VolumeChangedCallback = (volume: number) => void;

export class VolumeSlider {
    private _volumeListeners: VolumeChangedCallback[] = [];
    private _volumeRangeElement: HTMLInputElement | undefined;

    constructor(private _volume: number) {
    }

    public register(
        volumeRangeElement: HTMLInputElement,
    ) {
        this._volumeRangeElement = volumeRangeElement
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
}