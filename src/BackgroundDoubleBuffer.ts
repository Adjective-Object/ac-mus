import {
  ActiveMusicTrack,
  addHour,
  CurrentTrackInfo,
  Hour,
  MusicMeta,
  TimelineManager,
} from "./TimelineManager";

type BackgroundContainerElements = {
  styleAndContainerElement: HTMLElement;
  tileMaskElement: HTMLElement;
  tileElement: HTMLElement;
};

type BackgroundElementsAndState = {
  elements: BackgroundContainerElements;
  assignedToTimelinePosition?: Hour;
};

const CONTAINER_BUFFER_SIZE = 4;

function createBackground(): BackgroundContainerElements {
  const backgroundElement = document.createElement("div");
  const backgroundMaskElement = document.createElement("div");
  const backgroundScrollElement = document.createElement("div");

  backgroundElement.classList.add("background");
  backgroundMaskElement.classList.add("background-tile-mask");
  backgroundScrollElement.classList.add("background-tile");

  backgroundElement.appendChild(backgroundMaskElement);
  backgroundMaskElement.appendChild(backgroundScrollElement);

  return {
    styleAndContainerElement: backgroundElement,
    tileMaskElement: backgroundMaskElement,
    tileElement: backgroundScrollElement,
  };
}

function updateBackgroundToMeta(
  backgroundElements: BackgroundContainerElements,
  meta: MusicMeta
): void {
  if (meta?.backgroundTileImgUrl) {
    const bgImgUrl = `url('${meta.backgroundTileImgUrl}')`;
    backgroundElements.tileElement.style.backgroundImage = bgImgUrl;
    backgroundElements.tileElement.style.setProperty('--bg-tile', bgImgUrl);
  }

  if (meta?.backgroundStyle) {
    backgroundElements.styleAndContainerElement.style.background =
      meta.backgroundStyle;
  }

  for (let c of Array.from(backgroundElements.tileMaskElement.classList)) {
    if (c.endsWith("-blend")) {
      backgroundElements.tileMaskElement.classList.remove(c);
    }
  }

  backgroundElements.tileMaskElement.classList.add(
    (meta.blendMode || "default") + "-blend"
  );
  // remove and re-add to element tree to reset scrolling position
  const parent = backgroundElements.tileElement.parentElement;
  if (parent) {
    parent.removeChild(backgroundElements.tileElement);
    parent.appendChild(backgroundElements.tileElement);
  }
}

export class BackgroundDoubleBuffer {
  private _containers: BackgroundElementsAndState[] = [];
  private _commonBackground: HTMLDivElement | undefined;
  private _lastTrackPosition: Hour | undefined;

  constructor(private _timelineManager: TimelineManager) {}

  register(commonBackground: HTMLDivElement) {
    this._commonBackground = commonBackground;

    for (let i = 0; i < CONTAINER_BUFFER_SIZE; i++) {
      const backgroundElements = createBackground();
      this._containers.push({
        elements: backgroundElements,
      });
      commonBackground.appendChild(backgroundElements.styleAndContainerElement);
    }

    this._timelineManager.registerTimelineCallback(
      this._onTimelineUpdated.bind(this)
    );
  }

  private _onTimelineUpdated({
    currentTrack,
    nextTrack,
    previousTrack,
  }: CurrentTrackInfo) {
    const allocatedContainers = [
      currentTrack.timelinePosition,
      nextTrack.timelinePosition,
      previousTrack.timelinePosition,
    ];
    if (this._lastTrackPosition) {
      allocatedContainers.push(this._lastTrackPosition);
      allocatedContainers.push(addHour(this._lastTrackPosition, 1));
      allocatedContainers.push(addHour(this._lastTrackPosition, -1));
    }

    const freeContainers = this._containers.filter((x) =>
      allocatedContainers.every(
        (timelinePosition) => x.assignedToTimelinePosition !== timelinePosition
      )
    );

    this._findOrCreateBackground(
      previousTrack,
      this._containers,
      freeContainers
    );
    const current = this._findOrCreateBackground(
      currentTrack,
      this._containers,
      freeContainers
    );
    this._findOrCreateBackground(nextTrack, this._containers, freeContainers);

    for (let container of this._containers) {
      container.elements.styleAndContainerElement.classList.remove("active");
    }
    current.elements.styleAndContainerElement.classList.add("active");
    // set the common background
    if (this._commonBackground) {
      this._commonBackground.style.background =
        currentTrack.meta.backgroundStyle;
    }
    this._lastTrackPosition = currentTrack.timelinePosition;
  }

  /**
   *
   * @param track The track to find or create
   * @param containers The list of tracks to search through
   * @param freeContainers a subset of containers that we can pull from. This parameter is mutated.
   * @returns a container that has been updated to match the requested track's meta
   */
  private _findOrCreateBackground(
    track: ActiveMusicTrack,
    containers: BackgroundElementsAndState[],
    freeContainers: BackgroundElementsAndState[]
  ): BackgroundElementsAndState {
    for (let f of containers) {
      if (f.assignedToTimelinePosition === track.timelinePosition) {
        // find an existing container
        return f;
      }
    }

    // otherwise, grab a free container if possible
    const allocatedContainer = freeContainers.pop();
    if (!allocatedContainer) {
      throw new Error(
        `unable to free a container for track with timeline position ${track.timelinePosition}`
      );
    }

    // mutates the free containers list.
    updateBackgroundToMeta(allocatedContainer.elements, track.meta);
    allocatedContainer.assignedToTimelinePosition = track.timelinePosition;
    return allocatedContainer;
  }
}
