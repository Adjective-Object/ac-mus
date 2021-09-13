import "./style.css";
import { AudioPlayer } from "./AudioPlayer";
import { HourlyTimeline, TimelineManager } from "./TimelineManager";
import { MetaDisplay } from "./MetaDisplay";
import { TimeDisplay } from "./TimeDisplay";
import { BackgroundDoubleBuffer } from "./BackgroundDoubleBuffer";
import { VolumeSlider } from "./VolumeSlider";
import { AmbienceManager } from "./AmbienceManager";
import { AmbienceUI } from "./AmbienceUI";
import { FourierDisplay } from "./FourierDisplay";

const takingRootTimeline: HourlyTimeline = {
  0: {
    audioUrl: "./taking-root/music/0am-loop.mp3",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "12AM - Taking Root",
      bannerUrl: "./taking-root/img/default-banner-new.png",
      backgroundStyle: "linear-gradient(to bottom, #040825,#0a0a1e)",
      backgroundTileImgUrl: "./taking-root/img/tile-midnight.png",
      blendMode: "default",
      darkLight: "dark",
    },
  },
  1: {
    audioUrl: "./taking-root/music/11pm-loop.mp3",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "(track 01:00 not yet released)",
      bannerUrl: "./taking-root/img/default-banner-new.png",
      backgroundStyle: "linear-gradient(to bottom, #120733, #080818)",
      backgroundTileImgUrl: "./taking-root/img/tile-leaf.png",
      blendMode: "exclusion",
      darkLight: "dark",
    },
  },
  2: {
    audioUrl: "./taking-root/music/11pm-loop.mp3",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "(track 02:00 not yet released)",
      bannerUrl: "./taking-root/img/default-banner-new.png",
      backgroundStyle: "linear-gradient(to bottom, #120733, #080818)",
      backgroundTileImgUrl: "./taking-root/img/tile-leaf.png",
      blendMode: "exclusion",
      darkLight: "dark",
    },
  },
  3: {
    audioUrl: "./taking-root/music/11pm-loop.mp3",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "(track 03:00 not yet released)",
      bannerUrl: "./taking-root/img/default-banner-new.png",
      backgroundStyle: "linear-gradient(to bottom, #120733, #080818)",
      backgroundTileImgUrl: "./taking-root/img/tile-leaf.png",
      blendMode: "exclusion",
      darkLight: "dark",
    },
  },
  4: {
    audioUrl: "./taking-root/music/6am-loop.mp3",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "(track 04:00 not yet released)",
      bannerUrl: "./taking-root/img/default-banner-new.png",
      backgroundStyle: "linear-gradient(to bottom, #353393, #241b4d)",
      backgroundTileImgUrl: "./taking-root/img/tile-leaf.png",
      darkLight: "dark",
    },
  },
  5: {
    audioUrl: "./taking-root/music/6am-loop.mp3",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "(track 05:00 not yet released)",
      bannerUrl: "./taking-root/img/default-banner-new.png",
      backgroundStyle: "linear-gradient(to bottom, #d7561d, #faeec1)",
      backgroundTileImgUrl: "./taking-root/img/tile-leaf.png",
    },
  },
  6: {
    audioUrl: "./taking-root/music/6am-loop.mp3",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "6 AM - Taking Root",
      bannerUrl: "./taking-root/img/default-banner-new.png",
      backgroundStyle: "linear-gradient(to bottom, #d7561d, #faeec1)",
      backgroundTileImgUrl: "./taking-root/img/tile-shell.png",
    },
  },
  7: {
    audioUrl: "./taking-root/music/7am-loop.mp3",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "7 AM - Taking Root",
      bannerUrl: "./taking-root/img/default-banner-new.png",
      backgroundStyle: "linear-gradient(to bottom, #7ace20, #3f5117)",
      backgroundTileImgUrl: "./taking-root/img/tile-warm-fruit.png",
    },
  },
  8: {
    audioUrl: "./taking-root/music/8am-loop.mp3",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "8 AM - Taking Root",
      bannerUrl: "./taking-root/img/default-banner-new.png",
      backgroundStyle: "linear-gradient(to bottom, #67d0e7, #6fc4d5, #2b627f)",
      backgroundTileImgUrl: "./taking-root/img/tile-garden.png",
      blendMode: "default",
    },
  },
  9: {
    audioUrl: "./taking-root/music/9am-loop.mp3",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "9 AM - Taking Root",
      bannerUrl: "./taking-root/img/default-banner-new.png",
      backgroundStyle:
        "linear-gradient(to bottom, #94c743, #80b03b, #61a152, #1b6231)",
      backgroundTileImgUrl: "./taking-root/img/tile-work.png",
      blendMode: "transparent-soft",
    },
  },
  10: {
    audioUrl: "./taking-root/music/10am-loop.mp3",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "10 AM - Taking Root",
      bannerUrl: "./taking-root/img/default-banner-new.png",
      backgroundStyle: "linear-gradient(to bottom, #89d878, #42b760, #42b760)",
      backgroundTileImgUrl: "./taking-root/img/tile-butterflies-blue.png",
      blendMode: "half-visible",
    },
  },
  11: {
    audioUrl: "./taking-root/music/11am-loop.mp3",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "11 AM - Taking Root",
      bannerUrl: "./taking-root/img/default-banner-new.png",
      backgroundStyle: "linear-gradient(to bottom, #7ac9f6, #b5d3a1, #9ec87b)",
      backgroundTileImgUrl: "./taking-root/img/tile-weeb.png",
      blendMode: "gray-soft",
    },
  },
  12: {
    audioUrl: "./taking-root/music/12pm-loop.mp3",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "12 PM - Taking Root",
      bannerUrl: "./taking-root/img/default-banner-new.png",
      backgroundStyle:
        "linear-gradient(to bottom, #d9d7e5, #d5d4e4, #b97b75, #b94350)",
      backgroundTileImgUrl: "./taking-root/img/tile-cards.png",
      blendMode: "half-visible",
    },
  },
  13: {
    audioUrl: "./taking-root/music/1pm-loop.mp3",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "1 PM - Taking Root",
      bannerUrl: "./taking-root/img/default-banner-new.png",
      backgroundStyle:
        "linear-gradient(to bottom, #caa685, #c9a786, #c2af8f, #bcb697, #9d9786, #837e78)",
      backgroundTileImgUrl: "./taking-root/img/tile-bones.png",
      blendMode: "half-visible",
    },
  },
  14: {
    audioUrl: "./taking-root/music/2pm-loop.mp3",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "2 PM - Taking Root",
      bannerUrl: "./taking-root/img/default-banner-new.png",
      backgroundStyle: "linear-gradient(to bottom, #c9c0a9, #c39370, #b64a51)",
      backgroundTileImgUrl: "./taking-root/img/tile-cozy.png",
      blendMode: "gray-soft",
    },
  },
  15: {
    audioUrl: "./taking-root/music/3pm-loop.mp3",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "3 PM - Taking Root",
      bannerUrl: "./taking-root/img/default-banner-new.png",
      backgroundStyle: "linear-gradient(to bottom, #8a92ff, #c3c5fb, #dad9f9)",
      backgroundTileImgUrl: "./taking-root/img/tile-ski.png",
      blendMode: "half-visible",
    },
  },
  16: {
    audioUrl: "./taking-root/music/4pm-loop.mp3",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "4 PM - Taking Root",
      bannerUrl: "./taking-root/img/default-banner-new.png",
      backgroundStyle: "linear-gradient(to top, #7a597e, #b3a5bd, #b3a5bd)",
      backgroundTileImgUrl: "./taking-root/img/tile-rich-purple.png",
      blendMode: "half-visible",
    },
  },
  17: {
    audioUrl: "./taking-root/music/5pm-loop.mp3",
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
      title: "5 PM - Taking Root",
      bannerUrl: "./taking-root/img/default-banner-new.png",
      backgroundStyle:
        "linear-gradient(to top, #9384be, #a47fb5, #c490a6, #e8b8c7, #e8bac0)",
      backgroundTileImgUrl: "./taking-root/img/tile-shell.png",
      blendMode: "transparent-soft",
    },
  },
  18: {
    audioUrl: "./taking-root/music/6pm-loop.mp3",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "6 PM - Taking Root",
      bannerUrl: "./taking-root/img/default-banner-new.png",
      backgroundStyle: "linear-gradient(to bottom, #c753bb, #c573a6, #d087aa)",
      backgroundTileImgUrl: "./taking-root/img/tile-red-fish.png",
      blendMode: "half-visible",
    },
  },
  19: {
    audioUrl: "./taking-root/music/7pm-loop.mp3",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "7 PM - Taking Root",
      bannerUrl: "./taking-root/img/default-banner-new.png",
      backgroundStyle:
        "linear-gradient(to bottom, #885ab2, #855a88, #8a5f85, #a16f9c)",
      backgroundTileImgUrl: "./taking-root/img/tile-cards.png",
      blendMode: "gray-soft",
    },
  },
  20: {
    audioUrl: "./taking-root/music/8pm-loop.mp3",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "8 PM - Taking Root",
      bannerUrl: "./taking-root/img/default-banner-new.png",
      backgroundStyle: "linear-gradient(to bottom, #5a449d, #5a3e7a, #6e4c95)",
      backgroundTileImgUrl: "./taking-root/img/tile-evening.png",
      blendMode: "transparent-soft",
      darkLight: "dark",
    },
  },
  21: {
    audioUrl: "./taking-root/music/9pm-loop.mp3",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "9 PM - Taking Root",
      bannerUrl: "./taking-root/img/default-banner-new.png",
      backgroundStyle: "linear-gradient(to bottom, #353393, #241b4d)",
      backgroundTileImgUrl: "./taking-root/img/tile-latenight.png",
      blendMode: "transparent-soft",
      darkLight: "dark",
    },
  },
  22: {
    audioUrl: "./taking-root/music/10pm-loop.mp3",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "10 PM - Taking Root",
      bannerUrl: "./taking-root/img/default-banner-new.png",
      backgroundStyle: "linear-gradient(to bottom, #1c2742, #171730)",
      backgroundTileImgUrl: "./taking-root/img/tile-10pm.png",
      blendMode: "transparent-soft",
      darkLight: "dark",
    },
  },
  23: {
    audioUrl: "./taking-root/music/11pm-loop.mp3",
    meta: {
      by: [
        {
          name: "Scruffy",
          profileUrl: "https://twitter.com/Scruffy_Tweets",
        },
      ],
      title: "11 PM - Taking Root",
      bannerUrl: "./taking-root/img/default-banner-new.png",
      backgroundStyle: "linear-gradient(to bottom, #120733, #080818)",
      backgroundTileImgUrl: "./taking-root/img/tile-11pm.png",
      blendMode: "exclusion",
      darkLight: "dark",
    },
  },
};

const timelineManager = new TimelineManager(takingRootTimeline);
const volumeSlider = new VolumeSlider(0.8);
const player = new AudioPlayer(timelineManager, volumeSlider);
const metaDisplay = new MetaDisplay(timelineManager);
const timeDisplay = new TimeDisplay(timelineManager);
const backgroundDoubleBuffer = new BackgroundDoubleBuffer(timelineManager);
const ambienceManager = new AmbienceManager({
  calmRain: {
    name: "Calm Rain",
    audioAssets: [
      {
        url: "./ambience/env/Env_BaseRainCalm.mp3",
        fadeInDuration: 2,
        fadeOutDuration: 7,
        backupPlayDuration: 20.560062,
      },
    ],
    cycleMode: { type: "solid-loop" },
    sequenceMode: { type: "sequential" },
    iconUrl: "./ambience/icon/cloud-rain.svg",
    gainCap: 3,
  },
  indoorTentRain: {
    name: "Indoor Tent Rain",
    audioAssets: [
      {
        url: "./ambience/env/Env_IdrTent_BaseRainCalm00.mp3",
        fadeInDuration: 2,
        fadeOutDuration: 7,
        backupPlayDuration: 20.631583,
      },
    ],
    cycleMode: { type: "solid-loop" },
    sequenceMode: { type: "sequential" },
    iconUrl: "./ambience/icon/campground.svg",
    gainCap: 3,
  },
  grassWindSummerWeak: {
    name: "Weak Summer Wind",
    audioAssets: [
      {
        url: "./ambience/env/Env_GrassWindSummerWeak.mp3",
        fadeInDuration: 2,
        fadeOutDuration: 7,
        backupPlayDuration: 27.817666,
      },
    ],
    cycleMode: { type: "solid-loop" },
    sequenceMode: { type: "sequential" },
    iconUrl: "./ambience/icon/wind.svg",
  },
  campfire: {
    name: "Campfire",
    audioAssets: [
      {
        url: "./ambience/env/campfire-cagan-celik-freesound.mp3",
        fadeInDuration: 2,
        fadeOutDuration: 7,
        backupPlayDuration: 53.986168,
      },
    ],
    cycleMode: { type: "solid-loop" },
    sequenceMode: { type: "sequential" },
    iconUrl: "./ambience/icon/campfire.svg",
  },
  seaRocks: {
    name: "Trickling Stream",
    audioAssets: [
      {
        url: "./ambience/env/Env_SeaWaterrock00.mp3",
        fadeInDuration: 2,
        fadeOutDuration: 12,
        backupPlayDuration: 21,
      },
      {
        url: "./ambience/env/Env_SeaWaterrock01.mp3",
        fadeInDuration: 2,
        fadeOutDuration: 12,
        backupPlayDuration: 21,
      },
      {
        url: "./ambience/env/Env_SeaWaterrock02.mp3",
        fadeInDuration: 2,
        fadeOutDuration: 12,
        backupPlayDuration: 21,
      },
      {
        url: "./ambience/env/Env_SeaWaterrock03.mp3",
        fadeInDuration: 2,
        fadeOutDuration: 12,
        backupPlayDuration: 21,
      },
    ],
    cycleMode: { type: "solid-loop" },
    sequenceMode: { type: "random" },
    iconUrl: "./ambience/icon/water.svg",
  },
  seaWaves: {
    name: "Beach Waves",
    audioAssets: [
      {
        url: "./ambience/env/Env_SeaWaterWave00.mp3",
        fadeInDuration: 2,
        fadeOutDuration: 7,
        backupPlayDuration: 12.336,
      },
      {
        url: "./ambience/env/Env_SeaWaterWave01.mp3",
        fadeInDuration: 2,
        fadeOutDuration: 7,
        backupPlayDuration: 12.757333,
      },
      {
        url: "./ambience/env/Env_SeaWaterWave02.mp3",
        fadeInDuration: 2,
        fadeOutDuration: 7,
        backupPlayDuration: 14.404437,
      },
      {
        url: "./ambience/env/Env_SeaWaterWave03.mp3",
        fadeInDuration: 2,
        fadeOutDuration: 7,
        backupPlayDuration: 12.08,
      },
    ],
    cycleMode: { type: "solid-loop" },
    sequenceMode: { type: "random" },
    iconUrl: "./ambience/icon/umbrella-beach.svg",
  },
  bugs: {
    name: "Bugs",
    gainCap: 0.5,
    audioAssets: [
      {
        url: "./ambience/bugs/Insect_Aburazemi_WaitA01.mp3",
        fadeInDuration: 0,
        fadeOutDuration: 0,
        backupPlayDuration: 4,
      },
      {
        url: "./ambience/bugs/Insect_Aburazemi_WaitA.mp3",
        fadeInDuration: 0,
        fadeOutDuration: 0,
        backupPlayDuration: 4,
      },
      {
        url: "./ambience/bugs/Insect_Kirigirisu_Wait00.mp3",
        fadeInDuration: 0,
        fadeOutDuration: 0,
        backupPlayDuration: 4,
      },
      {
        url: "./ambience/bugs/Insect_Kirigirisu_Wait01.mp3",
        fadeInDuration: 0,
        fadeOutDuration: 0,
        backupPlayDuration: 4,
      },
      {
        url: "./ambience/bugs/Insect_Kohrogi_Wait00.mp3",
        fadeInDuration: 0,
        fadeOutDuration: 0,
        backupPlayDuration: 4,
      },
      {
        url: "./ambience/bugs/Insect_Kohrogi_Wait01.mp3",
        fadeInDuration: 0,
        fadeOutDuration: 0,
        backupPlayDuration: 4,
      },
      {
        url: "./ambience/bugs/Insect_Kumazemi_WaitA00.mp3",
        fadeInDuration: 0,
        fadeOutDuration: 0,
        backupPlayDuration: 4,
      },
      {
        url: "./ambience/bugs/Insect_Kumazemi_WaitB00.mp3",
        fadeInDuration: 0,
        fadeOutDuration: 0,
        backupPlayDuration: 4,
      },
      {
        url: "./ambience/bugs/Insect_Minminzemi_Wait00.mp3",
        fadeInDuration: 0,
        fadeOutDuration: 0,
        backupPlayDuration: 4,
      },
      {
        url: "./ambience/bugs/Insect_Minminzemi_Wait01.mp3",
        fadeInDuration: 0,
        fadeOutDuration: 0,
        backupPlayDuration: 4,
      },
      {
        url: "./ambience/bugs/Insect_Okera_Wait00.mp3",
        fadeInDuration: 0,
        fadeOutDuration: 0,
        backupPlayDuration: 4,
      },
      {
        url: "./ambience/bugs/Insect_Suzumushi_Wait00.mp3",
        fadeInDuration: 0,
        fadeOutDuration: 0,
        backupPlayDuration: 4,
      },
      {
        url: "./ambience/bugs/Insect_Suzumushi_Wait01.mp3",
        fadeInDuration: 0,
        fadeOutDuration: 0,
        backupPlayDuration: 4,
      },
      {
        url: "./ambience/bugs/Insect_Tsukutsukuhoushi_WaitA00.mp3",
        fadeInDuration: 0,
        fadeOutDuration: 0,
        backupPlayDuration: 4,
      },
      {
        url: "./ambience/bugs/Insect_Tsukutsukuhoushi_WaitA01.mp3",
        fadeInDuration: 0,
        fadeOutDuration: 0,
        backupPlayDuration: 4,
      },
      {
        url: "./ambience/bugs/Insect_Tsukutsukuhoushi_WaitA02.mp3",
        fadeInDuration: 0,
        fadeOutDuration: 0,
        backupPlayDuration: 4,
      },
      {
        url: "./ambience/bugs/Insect_Tsukutsukuhoushi_WaitB00.mp3",
        fadeInDuration: 0,
        fadeOutDuration: 0,
        backupPlayDuration: 4,
      },
      {
        url: "./ambience/bugs/Insect_Tsukutsukuhoushi_WaitB01.mp3",
        fadeInDuration: 0,
        fadeOutDuration: 0,
        backupPlayDuration: 4,
      },
      {
        url: "./ambience/bugs/Insect_Tsukutsukuhoushi_WaitB02.mp3",
        fadeInDuration: 0,
        fadeOutDuration: 0,
        backupPlayDuration: 4,
      },
      {
        url: "./ambience/bugs/Insect_Tsukutsukuhoushi_WaitC00.mp3",
        fadeInDuration: 0,
        fadeOutDuration: 0,
        backupPlayDuration: 4,
      },
    ],
    cycleMode: {
      type: "random-wait",
      minWaitSeconds: 0.2,
      maxWaitSeconds: 0.7,
    },
    sequenceMode: { type: "random" },
    iconUrl: "./ambience/icon/bug.svg",
    maxStartTimeOffset: 0,
  },
});
const ambienceUI = new AmbienceUI(ambienceManager);

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

const fftDisplay = new FourierDisplay(
  ambienceManager,
  3, // binCount
  "#109a76", // fillStyle
  128, // fftScaleRatio
  0.1 // binPaddingPercent
);

document.addEventListener("DOMContentLoaded", () => {
  // ambience menu toggle
  const ambienceToggleButton = assertElement(
    HTMLButtonElement,
    "#ambience-toggle"
  );
  const ambienceOuterContainer = assertElement(
    HTMLDivElement,
    "#ambience-outer-wrapper"
  );
  const ambienceUIContainer = assertElement(
    HTMLDivElement,
    "#ambience-ui-container"
  );
  let hasRestored = false;
  ambienceToggleButton.addEventListener("click", () => {
    ambienceOuterContainer.classList.toggle("open");
    if (!hasRestored) {
      hasRestored = true;
      ambienceManager.tryRestoreConfig();
    }
  });

  // set up ambient noise
  ambienceManager.register(
    assertElement(HTMLDivElement, "#ambience-audio-container")
  );
  ambienceUI.register(ambienceUIContainer);
  fftDisplay.register(assertElement(HTMLCanvasElement, "#ambience-fft-canvas"));

  // make sure timelineManager listeners are registered before we start the timeline
  player.register(assertElement(HTMLDivElement, "#music-host"));
  backgroundDoubleBuffer.register(
    assertElement(HTMLDivElement, "#backgrounds-host")
  );

  metaDisplay.register(
    assertElement(HTMLElement, "body"),
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

  volumeSlider.register(assertElement(HTMLInputElement, "#volume-slider"));

  // start the timeline
  timelineManager.start();

  const playPauseButtonUI =
    document.querySelector<HTMLButtonElement>("#play-pause-button")!;

  player.registerPlayPauseCallback((isPlaying: boolean) => {
    playPauseButtonUI.classList.remove("play");
    playPauseButtonUI.classList.remove("pause");
    playPauseButtonUI.innerHTML = isPlaying ? "Pause" : "Play";
    playPauseButtonUI.classList.add(isPlaying ? "pause" : "play");
  });

  function pausePlay() {
    if (player.isPlaying) {
      player.pause();
    } else {
      player.play();
    }
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
      if (
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLButtonElement) &&
        listenToKeys.some((k) => e.key === k)
      ) {
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
