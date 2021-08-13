import { CurrentTrackInfo, TimelineManager } from "./TimelineManager";

export class MetaDisplay {
    private _titleElement: HTMLElement | undefined;
    private _backgroundElement: HTMLElement | undefined;
    private _backgroundTileElement: HTMLElement | undefined;
    private _bannerImgElement: HTMLImageElement | undefined;

    constructor(private _timelineManager: TimelineManager) {
    }

    public register(
        titleElement: HTMLElement,
        bannerImgElement: HTMLImageElement,
        backgroundElement: HTMLElement,
        backgroundTileElement: HTMLElement,
    ) {
        this._timelineManager.registerTimelineCallback(
            this._onTrackUpdated.bind(this)
        )

        this._titleElement = titleElement;
        this._bannerImgElement = bannerImgElement
        this._backgroundElement = backgroundElement;
        this._backgroundTileElement = backgroundTileElement;
    }

    private _onTrackUpdated({currentTrack: {meta}}: CurrentTrackInfo): void {
        if (!this._titleElement || !this._backgroundElement || !this._bannerImgElement || !this._backgroundTileElement) {
            throw new Error('MetaDisplay._onTrackUpdated called before register()')
        }

        if (meta?.title) {
            this._titleElement.innerHTML = meta.title
        }
        if (meta?.backgroundStyle) {
            this._backgroundElement.style.background = meta.backgroundStyle
        }
        if (meta?.bannerUrl) {
            this._bannerImgElement.src = meta.bannerUrl
        }
        if (meta?.backgroundTileImgUrl) {
            this._backgroundTileElement.style.backgroundImage = `url('${meta.backgroundTileImgUrl}')`;
        }
 
        const blendMode = meta?.blendMode || 'default'
        // TODO this container should be DI'd as well.
        const backgroundContainer = this._backgroundTileElement.parentElement;
        if (backgroundContainer) {
            for (let c of Array.from(backgroundContainer.classList)) {
                if (c.endsWith('-blend')) {
                    backgroundContainer.classList.remove(c)
                }
            }
            backgroundContainer.classList.add(meta.blendMode + '-blend');    
        }
    }
}