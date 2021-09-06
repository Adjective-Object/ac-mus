import { AmbienceManager, AmbienceNode, DEFAULT_GAIN_CAP } from "./AmbienceManager";


class AmbienceNodeUI<TEntityId extends string> {
  private _parentElement?: HTMLElement;
  private _elementContainer?: HTMLElement;

  constructor(
    private _ambienceManager: AmbienceManager<TEntityId>,
    private _ambienceNode: AmbienceNode
  ) {}

  public register(parentElement: HTMLElement) {
    this._parentElement = parentElement;
    // create UI slider and bind event listeners

    const doc = this._parentElement.ownerDocument;
    this._elementContainer = doc.createElement("div");
    this._elementContainer.classList.add("ambience-node");

    const img = doc.createElement("img");
    img.classList.add("ambience-icon");
    img.src = this._ambienceNode.entity.iconUrl;
    img.alt=`${this._ambienceNode.entity.name}`

    const slidersContainer = doc.createElement('div')
    slidersContainer.classList.add('ambience-sliders-container')

    const volumeInput = doc.createElement("input");
    volumeInput.classList.add('ambience-slider', 'volume')
    volumeInput.type = "range";
    volumeInput.step = (0.01).toString();
    volumeInput.min = (0).toString();
    volumeInput.max = (this._ambienceNode.entity.gainCap ?? DEFAULT_GAIN_CAP).toString();
    volumeInput.value = this._ambienceManager.getAmbienceNodeVolume(this._ambienceNode.id).toString()
    volumeInput.title=`${this._ambienceNode.entity.name} Volume`

    volumeInput.addEventListener("input", () => {
      this._ambienceManager.updateAmbienceNodeVolume(
        this._ambienceNode.id,
        volumeInput.valueAsNumber
      );
    });

    const pannerInput = doc.createElement("input");
    pannerInput.classList.add('ambience-slider', 'panning')
    pannerInput.type = "range";
    pannerInput.min = (-1).toString();
    pannerInput.max = (1).toString();
    pannerInput.step = (0.01).toString();
    pannerInput.value = (this._ambienceManager.getAmbienceNodePan(this._ambienceNode.id)).toString()
    pannerInput.title=`${this._ambienceNode.entity.name} Left/Right Pan`

    pannerInput.addEventListener("input", () => {
      this._ambienceManager.updateAmbienceNodePanning(
        this._ambienceNode.id,
        pannerInput.valueAsNumber
      );
    });

    const closeButton = doc.createElement('button')
    closeButton.classList.add('close-button')
    closeButton.addEventListener('click', () => {
      this._ambienceManager.removeAmbienceNode(
        this._ambienceNode.id
      )
    })
    closeButton.title=`Remove ${this._ambienceNode.entity.name}`

    this._elementContainer.appendChild(img);
    this._elementContainer.appendChild(closeButton);
    const volumeInputContainer = doc.createElement('div')
    volumeInputContainer.classList.add('input-container', 'volume')
    volumeInputContainer.appendChild(volumeInput)
    slidersContainer.appendChild(volumeInputContainer);
    const pannerInputContainer = doc.createElement('div')
    pannerInputContainer.classList.add('input-container', 'panner')
    pannerInputContainer.appendChild(pannerInput)
    slidersContainer.appendChild(pannerInputContainer);
    this._elementContainer.appendChild(slidersContainer);

    parentElement.appendChild(this._elementContainer)
  }

  public unMountAndCleanup(): void {
    if (this._elementContainer) {
      this._parentElement?.removeChild(this._elementContainer);
    }
  }
}

export class AmbienceUI<TEntityId extends string> {
  private _ambienceNodeUIElements: Map<string, AmbienceNodeUI<TEntityId>> =
    new Map();
  private _ambienceUIContainer: HTMLElement | undefined;
  private _ambienceNodesContainer: HTMLElement | undefined;

  constructor(private _ambienceManager: AmbienceManager<TEntityId>) {}

  public register(ambienceUIContainer: HTMLElement) {
    this._ambienceUIContainer = ambienceUIContainer;
    this._ambienceManager.registerAddedORemovedCallback(
      this._onAmbienceNodeAdded.bind(this),
      this._onAmbienceNodeRemoved.bind(this)
    );

    this._mountAddRemoveUI();
    this._mountNodesContainer();
  }

  private _mountNodesContainer(
  ): void {
    if (!this._ambienceUIContainer) {
      throw new Error('tried to mount nodes container before registering?')
  }
    const doc = this._ambienceUIContainer.ownerDocument
    this._ambienceNodesContainer = doc.createElement('div')
    this._ambienceNodesContainer.classList.add('ambience-nodes-container')
    this._ambienceUIContainer.appendChild(this._ambienceNodesContainer)
  }

  private _mountAddRemoveUI(): void {
    if (!this._ambienceUIContainer) {
        throw new Error('tried to mount add/remove UI before registering?')
    }
    const doc = this._ambienceUIContainer.ownerDocument
    const container = doc.createElement('div')
    container.classList.add('ambience-add-remove-ui-wrapper')

    for (let [id, ambienceEntity] of this._ambienceManager.getAvailableEntities()) {
        const button = doc.createElement('button')
        button.classList.add('ambience-ui-add-button', 'media-button', 'smaller-media-button')
        button.title=`${ambienceEntity.name}`

        const img = doc.createElement("img");
        img.classList.add("ambience-icon");
        img.src = ambienceEntity.iconUrl;
    
        button.appendChild(img)
        button.addEventListener('click', () => {
            this._ambienceManager.addAmbienceNode(id, 0.4);
        })

        container.appendChild(button);
    }

    if (this._ambienceManager.getAvailableEntities().length > 1) {
      const randomizeButton = doc.createElement('button')
      randomizeButton.classList.add('ambience-ui-add-button', 'media-button', 'smaller-media-button', 'blue-button')
      randomizeButton.title=`Randomize Ambience`
  
      const img = doc.createElement("img");
      img.classList.add("ambience-icon");
      img.src='./ambience/icon/shuffle.svg'
  
      randomizeButton.appendChild(img)
      randomizeButton.addEventListener('click', () => {
          this._ambienceManager.randomizeAmbienceNodes(
            Math.round(Math.random() * 3 + 2)
          );
      })
      container.appendChild(randomizeButton);  
    }


    this._ambienceUIContainer.appendChild(container);
  }

  private _onAmbienceNodeAdded(node: AmbienceNode) {
    const newUI = new AmbienceNodeUI(this._ambienceManager, node);
    if (!this._ambienceNodesContainer) {
      throw new Error(
        "no _ambienceNodesContainer. _onAmbienceNodeAdded called before register()?"
      );
    }
    newUI.register(this._ambienceNodesContainer);
    this._ambienceNodeUIElements.set(node.id, newUI);
  }

  private _onAmbienceNodeRemoved(entity: AmbienceNode) {
    const uiToDelete = this._ambienceNodeUIElements.get(entity.id);
    if (!uiToDelete) {
      throw new Error(
        "tried to delete AmbienceNodeUI for which there was no existing ui"
      );
    }
    this._ambienceNodeUIElements.delete(entity.id);

    uiToDelete.unMountAndCleanup();
  }
}
