import "./style.css";
import { AudioPlayer } from "./AudioPlayer";
import { HourlyTimeline, TimelineManager } from "./TimelineManager";
import { MetaDisplay } from "./MetaDisplay";
import { TimeDisplay } from "./TimeDisplay";
import { BackgroundDoubleBuffer } from "./BackgroundDobuleBuffer";

const takingRootTimeline: HourlyTimeline = {
  0: {
    audioUrl:
      "/taking-root/music/6 AM - Animal Crossing - Taking Root-f8pYxhDEgfg.opus",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "(waiting for track for 00:00)",
      bannerUrl: "/taking-root/img/default-banner.png",
      backgroundStyle:
        "linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))",
      backgroundTileImgUrl: "/taking-root/img/tile-leaf.png",
    },
  },
  1: {
    audioUrl:
      "/taking-root/music/6 AM - Animal Crossing - Taking Root-f8pYxhDEgfg.opus",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "(waiting for track for 01:00)",
      bannerUrl: "/taking-root/img/default-banner.png",
      backgroundStyle:
        "linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))",
      backgroundTileImgUrl: "/taking-root/img/tile-leaf.png",
    },
  },
  2: {
    audioUrl:
      "/taking-root/music/6 AM - Animal Crossing - Taking Root-f8pYxhDEgfg.opus",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "(waiting for track for 02:00)",
      bannerUrl: "/taking-root/img/default-banner.png",
      backgroundStyle:
        "linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))",
      backgroundTileImgUrl: "/taking-root/img/tile-leaf.png",
    },
  },
  3: {
    audioUrl:
      "/taking-root/music/6 AM - Animal Crossing - Taking Root-f8pYxhDEgfg.opus",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "(waiting for track for 03:00)",
      bannerUrl: "/taking-root/img/default-banner.png",
      backgroundStyle:
        "linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))",
      backgroundTileImgUrl: "/taking-root/img/tile-leaf.png",
    },
  },
  4: {
    audioUrl:
      "/taking-root/music/6 AM - Animal Crossing - Taking Root-f8pYxhDEgfg.opus",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "(waiting for track for 04:00)",
      bannerUrl: "/taking-root/img/default-banner.png",
      backgroundStyle:
        "linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))",
      backgroundTileImgUrl: "/taking-root/img/tile-leaf.png",
    },
  },
  5: {
    audioUrl:
      "/taking-root/music/6 AM - Animal Crossing - Taking Root-f8pYxhDEgfg.opus",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "(waiting for track for 05:00)",
      bannerUrl: "/taking-root/img/default-banner.png",
      backgroundStyle:
        "linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))",
      backgroundTileImgUrl: "/taking-root/img/tile-leaf.png",
    },
  },
  6: {
    audioUrl: "/taking-root/music/6am-loop.ogg",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "6 AM - Animal Crossing - Taking Root",
      bannerUrl: "/taking-root/img/default-banner.png",
      backgroundStyle: "linear-gradient(to bottom, #d7561d, #faeec1)",
      backgroundTileImgUrl: "/taking-root/img/tile-shell.png",
    },
  },
  7: {
    audioUrl: "/taking-root/music/7am-loop.ogg",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "7 AM - Animal Crossing - Taking Root",
      bannerUrl: "/taking-root/img/default-banner.png",
      backgroundStyle: "linear-gradient(to bottom, #7ace20, #3f5117)",
      backgroundTileImgUrl: "/taking-root/img/tile-warm-fruit.png",
    },
  },
  8: {
    audioUrl: "/taking-root/music/8am-loop.ogg",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "8 AM - Animal Crossing - Taking Root",
      bannerUrl: "/taking-root/img/default-banner.png",
      backgroundStyle: "linear-gradient(to bottom, #67d0e7, #6fc4d5, #2b627f)",
      backgroundTileImgUrl: "/taking-root/img/tile-garden.png",
    },
  },
  9: {
    audioUrl: "/taking-root/music/9am-loop.ogg",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "9 AM - Animal Crossing - Taking Root",
      bannerUrl: "/taking-root/img/default-banner.png",
      backgroundStyle:
        "linear-gradient(to bottom, #94c743, #80b03b, #61a152, #1b6231)",
      backgroundTileImgUrl: "/taking-root/img/tile-work.png",
    },
  },
  10: {
    audioUrl: "/taking-root/music/10am-loop.ogg",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "10 AM - Animal Crossing - Taking Root",
      bannerUrl: "/taking-root/img/default-banner.png",
      backgroundStyle: "linear-gradient(to bottom, #89d878, #42b760, #42b760)",
      backgroundTileImgUrl: "/taking-root/img/tile-butterflies-blue.png",
      blendMode: "half-visible",
    },
  },
  11: {
    audioUrl: "/taking-root/music/11am-loop.ogg",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "11 AM - Animal Crossing - Taking Root",
      bannerUrl: "/taking-root/img/default-banner.png",
      backgroundStyle: "linear-gradient(to bottom, #7ac9f6, #b5d3a1, #9ec87b)",
      backgroundTileImgUrl: "/taking-root/img/tile-weeb.png",
      blendMode: "gray-soft",
    },
  },
  12: {
    audioUrl: "/taking-root/music/12pm-loop.ogg",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "12 PM - Animal Crossing - Taking Root",
      bannerUrl: "/taking-root/img/default-banner.png",
      backgroundStyle:
        "linear-gradient(to bottom, #d9d7e5, #d5d4e4, #b97b75, #b94350)",
      backgroundTileImgUrl: "/taking-root/img/tile-cards.png",
      blendMode: "half-visible",
    },
  },
  13: {
    audioUrl: "/taking-root/music/1pm-loop.ogg",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "1 PM - Animal Crossing - Taking Root",
      bannerUrl: "/taking-root/img/default-banner.png",
      backgroundStyle:
        "linear-gradient(to bottom, #caa685, #c9a786, #c2af8f, #bcb697, #9d9786, #837e78)",
      backgroundTileImgUrl: "/taking-root/img/tile-bones.png",
      blendMode: "half-visible",
    },
  },
  14: {
    audioUrl: "/taking-root/music/2pm-loop.ogg",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "2 PM - Animal Crossing - Taking Root",
      bannerUrl: "/taking-root/img/default-banner.png",
      backgroundStyle: "linear-gradient(to bottom, #c9c0a9, #c39370, #b64a51)",
      backgroundTileImgUrl: "/taking-root/img/tile-cozy.png",
      blendMode: "gray-soft",
    },
  },
  15: {
    audioUrl: "/taking-root/music/3pm-loop.ogg",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "3 PM - Animal Crossing - Taking Root",
      bannerUrl: "/taking-root/img/default-banner.png",
      backgroundStyle: "linear-gradient(to bottom, #8a92ff, #c3c5fb, #dad9f9)",
      backgroundTileImgUrl: "/taking-root/img/tile-ski.png",
      blendMode: "half-visible",
    },
  },
  16: {
    audioUrl: "/taking-root/music/4pm-loop.ogg",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "4 PM - Animal Crossing - Taking Root",
      bannerUrl: "/taking-root/img/default-banner.png",
      backgroundStyle:
        "linear-gradient(to top, #5b4867, #7a597e, #b3a5bd, #b3a5bd)",
      backgroundTileImgUrl: "/taking-root/img/tile-rich-purple.png",
      blendMode: "half-visible",
    },
  },
  17: {
    audioUrl: "/taking-root/music/5pm-loop.ogg",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
        {
          name: "⚣ RUD ⚣",
          profileUrl: "https://twitter.com/driftrud",
        },
      ],
      title: "5 PM - Animal Crossing - Taking Root",
      bannerUrl: "/taking-root/img/default-banner.png",
      backgroundStyle:
        "linear-gradient(to top, #9384be, #a47fb5, #c490a6, #e8b8c7, #e8bac0)",
      backgroundTileImgUrl: "/taking-root/img/tile-shell.png",
      blendMode: "transparent-soft",
    },
  },
  18: {
    audioUrl: "/taking-root/music/6pm-loop.ogg",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "6 PM - Animal Crossing - Taking Root",
      bannerUrl: "/taking-root/img/default-banner.png",
      backgroundStyle: "linear-gradient(to bottom, #c753bb, #c573a6, #d087aa)",
      backgroundTileImgUrl: "/taking-root/img/tile-red-fish.png",
      blendMode: "half-visible",
    },
  },
  19: {
    audioUrl: "/taking-root/music/7pm-loop.ogg",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "7 PM - Animal Crossing - Taking Root",
      bannerUrl: "/taking-root/img/default-banner.png",
      backgroundStyle:
        "linear-gradient(to bottom, #885ab2, #855a88, #8a5f85, #a16f9c)",
      backgroundTileImgUrl: "/taking-root/img/tile-cards.png",
      blendMode: "gray-soft",
    },
  },
  20: {
    audioUrl: "/taking-root/music/8pm-loop.ogg",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "8 PM - Animal Crossing - Taking Root",
      bannerUrl: "/taking-root/img/default-banner.png",
      backgroundStyle: "linear-gradient(to bottom, #5a449d, #5a3e7a, #6e4c95)",
      backgroundTileImgUrl: "/taking-root/img/tile-evening.png",
      blendMode: "transparent-soft",
    },
  },
  21: {
    audioUrl: "/taking-root/music/9pm-loop.ogg",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "9 PM - Animal Crossing - Taking Root",
      bannerUrl: "/taking-root/img/default-banner.png",
      backgroundStyle: "linear-gradient(to bottom, #353393, #241b4d)",
      backgroundTileImgUrl: "/taking-root/img/tile-latenight.png",
      blendMode: "transparent-soft",
    },
  },
  22: {
    audioUrl:
      "/taking-root/music/8 PM - Animal Crossing - Taking Root-j93RsBBPG5E.webm",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "(waiting for track for 22:00)",
      bannerUrl: "/taking-root/img/default-banner.png",
      backgroundStyle:
        "linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))",
      backgroundTileImgUrl: "/taking-root/img/tile-leaf.png",
    },
  },
  23: {
    audioUrl:
      "/taking-root/music/8 PM - Animal Crossing - Taking Root-j93RsBBPG5E.webm",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "(waiting for track for 23:00)",
      bannerUrl: "/taking-root/img/default-banner.png",
      backgroundStyle:
        "linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))",
      backgroundTileImgUrl: "/taking-root/img/tile-leaf.png",
    },
  },
};

const timelineManager = new TimelineManager(takingRootTimeline);
const player = new AudioPlayer(timelineManager);
const metaDisplay = new MetaDisplay(timelineManager);
const timeDisplay = new TimeDisplay(timelineManager);
const backgroundDoubleBuffer = new BackgroundDoubleBuffer(timelineManager);

type ConstructorOf<T> = {
  new (...args: any[]): T;
};

function assertElement<T extends HTMLElement>(
  elementType: ConstructorOf<T>,
  selector: string
): T {
  const instance = document.querySelector(selector);
  if (instance instanceof elementType) {
    return instance;
  } else {
    throw new Error(`Selector ${selector} was not a ${elementType.name}`);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // make sure timelineManager listeners are registered before we start the timeline
  player.register(assertElement(HTMLDivElement, "#music-host"));
  backgroundDoubleBuffer.register(
    assertElement(HTMLDivElement, "#backgrounds-host")
  );

  metaDisplay.register(
    assertElement(HTMLElement, "#meta-music-title"),
    assertElement(HTMLImageElement, "#meta-banner-img"),
    assertElement(HTMLElement, "#meta-artist-container")
  );

  const prevHourButton = assertElement(
    HTMLButtonElement,
    "#previous-hour-button"
  );
  const nextHourButton = assertElement(HTMLButtonElement, "#next-hour-button");
  timeDisplay.register(prevHourButton, nextHourButton);

  // start the timeline
  timelineManager.start();

  const playPauseButtonUI =
    document.querySelector<HTMLButtonElement>("#play-pause-button")!;

  function pausePlay() {
    if (player.isPlaying) {
      player.pause();
    } else {
      player.play();
    }

    playPauseButtonUI.classList.remove("play");
    playPauseButtonUI.classList.remove("pause");
    playPauseButtonUI.innerHTML = player.isPlaying ? "Pause" : "Play";
    playPauseButtonUI.classList.add(player.isPlaying ? "pause" : "play");
  }

  playPauseButtonUI.addEventListener("click", () => {
    pausePlay();
  });

  function bindButton(
    button: HTMLButtonElement,
    key: string | string[],
    cb: () => void
  ) {
    let keyUpTimeout: number | null = null;
    let listenToKeys: string[] = Array.isArray(key) ? key : [key];

    document.addEventListener("keyup", (e) => {
      if (listenToKeys.some((k) => e.key === k)) {
        button.classList.remove("pressed");
        if (keyUpTimeout !== null) {
          clearTimeout(keyUpTimeout);
        }
      }
    });

    document.addEventListener("keydown", (e) => {
      if (listenToKeys.some((k) => e.key === k)) {
        cb();

        button.classList.add("pressed");
        keyUpTimeout = setTimeout(() => {
          button.classList.remove("pressed");
        }, 3000);
      }
    });
  }

  bindButton(playPauseButtonUI, " ", () => {
    pausePlay();
  });

  bindButton(prevHourButton, ["ArrowLeft", "a"], () => {
    timelineManager.setHourOffset(timelineManager.hourOffset - 1);
  });

  bindButton(nextHourButton, ["ArrowRight", "d"], () => {
    timelineManager.setHourOffset(timelineManager.hourOffset + 1);
  });
});
