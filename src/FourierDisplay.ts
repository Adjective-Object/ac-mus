import { AmbienceManager } from "./AmbienceManager";

export class FourierDisplay {
  _audioSource?: AudioNode;
  _analyser?: AnalyserNode;
  _out_arr?: Uint8Array;
  _targetCanvas?: HTMLCanvasElement;
  _canvasCtx2D?: CanvasRenderingContext2D;
  _binSums: number[];
  _binCounts: number[];

  _binWidth?: number;
  _binGap?: number;

  constructor(
    private _ambienceManager: AmbienceManager<any>,
    public _binCount: number,
    public _fillStyle: string,
    public _fftScaleRatio: number,
    public _binPaddingPercent: number
  ) {
    this._binSums = Array(this._binCount).fill(0);
    this._binCounts = Array(this._binCount).fill(0);
  }

  register(targetCanvas: HTMLCanvasElement) {
    this._targetCanvas = targetCanvas;
    this._binGap = this._targetCanvas.width * this._binPaddingPercent;
    this._ambienceManager.registerOnBeforeNodeAddedCallback(
      this._onAmbienceNodeAdded.bind(this)
    );
  }

  private running: boolean = false;
  private _onAmbienceNodeAdded() {
    if (!this.running) {
      this.running = true;
      this._start();
    }
  }

  private _initialize() {
    if (!this._targetCanvas || !this._binGap) {
        throw new Error("delayedRegister called before canvas was registere");
      }
  
      this._audioSource = this._ambienceManager.insertAnalyser();
      const context = this._targetCanvas.getContext("2d");
      if (!context) {
        throw new Error(
          "failed to get canvas 2d context: cannot render ambience FFT"
        );
      }
      this._canvasCtx2D = context;
      this._analyser = this._audioSource.context.createAnalyser();
      this._analyser.fftSize = 64;
      // this._analyser.smoothingTimeConstant = 0.88;
      this._audioSource.connect(this._analyser);
  
      this._binWidth =
        (this._targetCanvas.width - this._binGap * (this._binCount - 1)) /
        this._binCount;
  
      this._out_arr = new Uint8Array(this._analyser.frequencyBinCount);
      if (this._analyser.frequencyBinCount < this._binCount) {
        console.warn(
          `Real bin count ${this._analyser.frequencyBinCount} was less than expected bin count ${this._binCount}`
        );
      }
  }

  private initialized: boolean = false;
  private _overrunFrameCount = 0;
  private _start() {
    if (!this.initialized) {
        this. initialized = true
        this._initialize()
    }
    this._overrunFrameCount = 0;
    requestAnimationFrame(this._animate.bind(this as any));
  }

  private _animate(this: Required<FourierDisplay> & FourierDisplay) {
    this._render();
    if (this._ambienceManager.isPlaying()) {
        requestAnimationFrame(this._animate.bind(this));
    } else {
        if (this._overrunFrameCount > this._analyser.fftSize) {
            this._clearCanvas();
            this.running = false
        } else {
            requestAnimationFrame(this._animate.bind(this));
            this._overrunFrameCount += 1;
        }
    }
  }

  private _clearCanvas(this: Required<FourierDisplay> & FourierDisplay) {
    this._canvasCtx2D.clearRect(
        0,
        0,
        this._targetCanvas.width,
        this._targetCanvas.height
      );  
  }

  private _render(this: Required<FourierDisplay> & FourierDisplay) {
    this._analyser.getByteFrequencyData(this._out_arr!);
    this._clearCanvas();

    for (let i = 0; i < this._binCount; i++) {
      this._binSums[i] = 0;
      this._binCounts[i] = 0;
    }

    let maxNonzeroIdx = 1;
    for (let i = 0; i < this._out_arr.length; i++) {
      if (this._out_arr[i] > 0) {
        maxNonzeroIdx = i;
      }
    }

    for (let i = 0; i < maxNonzeroIdx; i++) {
      const percent = i / maxNonzeroIdx;
      const binIdx = Math.floor(percent * this._binCount);
      this._binSums[binIdx] += this._out_arr[i];
      this._binCounts[binIdx] += 1;
    }

    const binSkip = this._binWidth! + this._binGap!;
    this._canvasCtx2D.fillStyle = this._fillStyle;
    let maxRatio = this._fftScaleRatio;
    for (let i = 0; i < this._binCount; i++) {
      maxRatio = Math.max(maxRatio, this._binSums[i] / this._binCounts[i]);
    }

    for (let i = 0; i < this._binCount; i++) {
      const ratio = this._binSums[i] / this._binCounts[i] / maxRatio;

      const h = this._targetCanvas.height * ratio;
      this._canvasCtx2D.fillRect(
        binSkip * i,
        this._targetCanvas.height - h,
        this._binWidth!,
        h
      );
    }
  }
}
