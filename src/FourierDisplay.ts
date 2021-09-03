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
    public _binCount: number,
    public _fillStyle: string,
    public _fftScaleRatio: number
  ) {
    this._binSums = Array(this._binCount).fill(0);
    this._binCounts = Array(this._binCount).fill(0);
  } 

  register(
    targetCanvas: HTMLCanvasElement,
    audioSource: AudioNode,
    binPaddingPercent: number
  ) {
    this._audioSource = audioSource;
    this._targetCanvas = targetCanvas;
    const context = targetCanvas.getContext("2d");
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

    this._binGap = binPaddingPercent * this._targetCanvas.width;
    this._binWidth = Math.floor(
      (this._targetCanvas.width - this._binGap * (this._binCount - 1)) /
        this._binCount
    );

    this._out_arr = new Uint8Array(this._analyser.frequencyBinCount);
    if (this._analyser.frequencyBinCount < this._binCount) {
      console.warn(
        `Real bin count ${this._analyser.frequencyBinCount} was less than expected bin count ${this._binCount}`
      );
    }

    console.log(this._binGap, this._binWidth);

    requestAnimationFrame(this._animate.bind(this as any));
  }

  private _animate(this: Required<FourierDisplay> & FourierDisplay) {
    this._render();
    requestAnimationFrame(this._animate.bind(this));
  }

  private _render(this: Required<FourierDisplay>) {
    this._analyser.getByteFrequencyData(this._out_arr!);
    this._canvasCtx2D.clearRect(
      0,
      0,
      this._targetCanvas.width,
      this._targetCanvas.height
    );

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
