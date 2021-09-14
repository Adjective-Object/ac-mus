import { AudioPlayer } from "./AudioPlayer";

export class BellButton {
  private _button: HTMLButtonElement | undefined;

  constructor(private _audioPlayer: AudioPlayer) {}

  public register(button: HTMLButtonElement) {
    this._button = button;
    this._button.addEventListener("click", this._buttonClicked.bind(this));
    this._updateButtonUI();
  }

  private _buttonClicked() {
      this.toggleBell();
  }

  public toggleBell() {
    this._audioPlayer.setBellChimeEnabled(
    !this._audioPlayer.isBellChimeEnabled
    );
    this._updateButtonUI();  
  }

  private _updateButtonUI() {
    if (this._button) {
      this._button.classList.toggle(
        "bell-enabled",
        this._audioPlayer.isBellChimeEnabled
      );
      this._button.innerText = `${
        this._audioPlayer.isBellChimeEnabled ? "Disable" : "Enable"
      } Hourly Bell`;
    }
  }
}
