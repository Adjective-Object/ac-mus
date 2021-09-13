import {
  AmbienceEntityWithId,
  AmbienceManager,
  AmbienceNode,
  DEFAULT_GAIN_CAP,
} from "./AmbienceManager";

const AMBIENCE_CONFIG_KEY = "ac.ambience_config";

type SerializedAmbienceNode = {
  entityId: string;
  pan: number;
  gain: number;
};

type SerializedConfig = Record<string, SerializedAmbienceNode>;

export function saveConfigToLocalStorage(
  ambienceNodes: Map<string, AmbienceNode>
): void {
  let serializedAmbienceObject: Record<string, SerializedAmbienceNode> = {};
  for (let [nodeId, node] of ambienceNodes.entries()) {
    serializedAmbienceObject[nodeId] = {
      pan: node.panner.pan.value,
      gain:
        node.audioSources[0].volumeGain.gain.value /
        (node.entity.gainCap ?? DEFAULT_GAIN_CAP),
      entityId: node.entity.id,
    };
  }

  localStorage.setItem(
    AMBIENCE_CONFIG_KEY,
    JSON.stringify(serializedAmbienceObject)
  );
}

export function restoreConfigFromLocalStorage<TEntityId extends string>(
  knownEntities: Record<TEntityId, AmbienceEntityWithId>,
  manager: AmbienceManager<TEntityId>
): void {
  try {
    const n = localStorage.getItem(AMBIENCE_CONFIG_KEY);
    if (!n) {
    console.warn("null at ", AMBIENCE_CONFIG_KEY);
      return undefined;
    }
    const rawConfig = JSON.parse(n);
    if (!isSerializedConfig(new Set(Object.keys(knownEntities)), rawConfig)) {
        console.warn("not a legal config", rawConfig);
        return undefined;
    }

    for (let k of Object.keys(rawConfig)) {
      manager.addAmbienceNode(
        rawConfig[k].entityId as TEntityId,
        rawConfig[k].gain,
        rawConfig[k].pan
      );
    }
  } catch (e) {
    console.warn("Error loading config:", e);
    return undefined;
  }
}

function isSerializedConfig(
  knownEntityIds: Set<string>,
  x: any
): x is SerializedConfig {
  if (x === null || typeof x !== "object") {
    return false;
  }

  for (let [k, v] of Object.entries(x)) {
    if (typeof k !== "string") {
      return false;
    }

    if (typeof v !== "object") {
      return false;
    }

    if (v === null) {
      return false;
    }

    if (
      !v.hasOwnProperty("entityId") ||
      !v.hasOwnProperty("pan") ||
      !v.hasOwnProperty("gain")
    ) {
      return false;
    }

    const vWithPropsPresent = v as {
        entityId: any,
        pan: any,
        gain: any
    }

    if (
        typeof vWithPropsPresent.entityId !== 'string' ||
        typeof vWithPropsPresent.pan !== 'number' ||
        typeof vWithPropsPresent.gain !== 'number'
      ) {
        return false;
      }
  

    if (!knownEntityIds.has(vWithPropsPresent.entityId)) {
      return false;
    }  
}

  return true;
}
