import { TimelineManager } from "./TimelineManager";

export class TimeDisplay {

    private _skipBackButton: HTMLButtonElement | undefined;
    private _skipNextButton: HTMLButtonElement | undefined;

    constructor(private _timelineManager: TimelineManager) {
    }

    public register(
         skipBackButton: HTMLButtonElement,
         skipNextButton: HTMLButtonElement,
    ) {
        this._skipBackButton = skipBackButton;
        this._skipNextButton = skipNextButton;

        this._skipBackButton.addEventListener('click', this._skipBack.bind(this))
        this._skipNextButton.addEventListener('click', this._skipNext.bind(this))
    }

    private _skipBack() {
        this._timelineManager.setHourOffset(this._timelineManager.hourOffset - 1)
    }

    private _skipNext() {
        this._timelineManager.setHourOffset(this._timelineManager.hourOffset + 1)
    }
}