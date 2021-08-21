import { CurrentTrackInfo, TimelineManager } from "./TimelineManager";

export class MetaDisplay {
    private _titleElement: HTMLElement | undefined;
    private _backgroundElement: HTMLElement | undefined;
    private _backgroundTileElement: HTMLElement | undefined;
    private _bannerImgElement: HTMLImageElement | undefined;
    private _artistContainer: HTMLElement | undefined;

    constructor(private _timelineManager: TimelineManager) {
    }

    public register(
        titleElement: HTMLElement,
        bannerImgElement: HTMLImageElement,
        backgroundElement: HTMLElement,
        backgroundTileElement: HTMLElement,
        artistCon_artistContainer: HTMLElement,
    ) {
        this._timelineManager.registerTimelineCallback(
            this._onTrackUpdated.bind(this)
        )

        this._titleElement = titleElement;
        this._bannerImgElement = bannerImgElement
        this._backgroundElement = backgroundElement;
        this._backgroundTileElement = backgroundTileElement;
        this._artistContainer = artistCon_artistContainer;
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

        if (meta?.by && this._artistContainer) {
            while(this._artistContainer.childNodes.length) {
                this._artistContainer?.removeChild(this._artistContainer.childNodes[0])
            }
            const artistLinks = meta.by.map(by => {
                const link = document.createElement('a');
                link.textContent = by.name;
                link.href = by.profileUrl;
                return link
            })
            let currentArtist: HTMLAnchorElement | undefined;
            while (currentArtist = artistLinks.shift()) {
                this._artistContainer.appendChild(currentArtist);
                if (artistLinks.length && meta.by.length > 2) {
                    this._artistContainer.appendChild(document.createTextNode(", "))
                }
                if (artistLinks.length == 1) {
                    this._artistContainer.appendChild(document.createTextNode(" and "))
                }
            }
            this._backgroundTileElement.style.backgroundImage = `url('${meta.backgroundTileImgUrl}')`;
        }
 
 
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