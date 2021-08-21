import { CurrentTrackInfo, TimelineManager } from "./TimelineManager";

export class MetaDisplay {
  private _titleElement: HTMLElement | undefined;
  private _bannerImgElement: HTMLImageElement | undefined;
  private _artistContainer: HTMLElement | undefined;
  private _container: HTMLElement | undefined;

  constructor(private _timelineManager: TimelineManager) {}

  public register(
    container: HTMLElement,
    titleElement: HTMLElement,
    bannerImgElement: HTMLImageElement,
    artistContainer: HTMLElement
  ) {
    this._timelineManager.registerTimelineCallback(
      this._onTrackUpdated.bind(this)
    );

    this._container = container;
    this._titleElement = titleElement;
    this._bannerImgElement = bannerImgElement;
    this._artistContainer = artistContainer;
  }

  private _onTrackUpdated({ currentTrack: { meta } }: CurrentTrackInfo): void {
    if (!this._container || !this._titleElement || !this._bannerImgElement) {
      throw new Error("MetaDisplay._onTrackUpdated called before register()");
    }

    if (meta?.darkLight === 'dark') {
        this._container.classList.add('darkmode')
    } else {
        this._container.classList.remove('darkmode')
    }


    if (meta?.title) {
      this._titleElement.innerHTML = meta.title;
    }
    if (meta?.bannerUrl) {
      this._bannerImgElement.src = meta.bannerUrl;
    }

    if (meta?.by && this._artistContainer) {
      while (this._artistContainer.childNodes.length) {
        this._artistContainer?.removeChild(this._artistContainer.childNodes[0]);
      }
      const artistLinks = meta.by.map((by) => {
        const link = document.createElement("a");
        link.textContent = by.name;
        link.href = by.profileUrl;
        return link;
      });
      let currentArtist: HTMLAnchorElement | undefined;
      while ((currentArtist = artistLinks.shift())) {
        this._artistContainer.appendChild(currentArtist);
        if (artistLinks.length && meta.by.length > 2) {
          this._artistContainer.appendChild(document.createTextNode(", "));
        }
        if (artistLinks.length == 1) {
          this._artistContainer.appendChild(document.createTextNode(" and "));
        }
      }
    }
  }
}
