import { Face } from "./road";
import { simulation } from "./simulation";

export enum Signal {
  Red = "red",
  Yellow = "yellow",
  Flashing = "flashing",
  Green = "green",
}

export interface LightState {
  duration: number;
  signal: Record<Face, { primary: Signal; left: Signal; right: Signal }>;
}

export class TrafficLight {
  private cycle: LightState[];
  private cycleIndex: number = 0;
  private injectedCycle: LightState[] | undefined;
  private injectedCycleIndex: number = 0;
  private currentTickCount: number = 0;
  private crossWalkRequested: Face | undefined;
  private onTick = this.cycleTrafficLight.bind(this);
  private onLightChange: ((state: LightState) => void) | undefined;

  constructor() {
    this.cycle = TrafficLight.getLightCycle();
    simulation.addOnTick(this.onTick);
  }

  currentState() {
    // If some traffic light state has been injected into the flow,
    // that takes precedence.
    if (this.injectedCycle?.[this.injectedCycleIndex]) {
      return this.injectedCycle[this.injectedCycleIndex];
    }

    return this.cycle?.[this.cycleIndex] ?? this.cycle[0];
  }

  setOnLightChange(cb: (state: LightState) => void) {
    this.onLightChange = cb;
    this.onLightChange(this.currentState());
  }

  requestCrossWalk(face: Face) {
    if (this.crossWalkRequested) {
      return;
    }
    this.crossWalkRequested = face;
  }

  private cycleTrafficLight() {
    if (this.currentTickCount + 1 >= this.currentState().duration) {
      this.nextState();
      this.currentTickCount = 0;
    } else {
      this.currentTickCount++;
    }
  }

  private nextState() {
    if (this.crossWalkRequested) {
      // This could be smarter. Maybe with some backoff to prevent
      // spamming of cross walk button and blocking traffic
      this.injectCrossWalk();
    } else if (this.injectedCycle?.[this.injectedCycleIndex + 1]) {
      this.injectedCycleIndex++;
    } else {
      this.injectedCycle = undefined;
      this.cycleIndex =
        this.cycleIndex >= this.cycle.length - 1 ? 0 : this.cycleIndex + 1;
    }

    this.onLightChange?.(this.currentState());
    return this.currentState();
  }

  private injectCrossWalk() {
    const face = this.crossWalkRequested!;
    this.crossWalkRequested = undefined;
    this.injectedCycle = this.getCrossWalkCycle(face);
    this.injectedCycleIndex = 0;
    const resumeIndex =
      this.cycle.findIndex(
        (state) => state.signal[face].primary === Signal.Green
      ) - 1;
    this.cycleIndex = resumeIndex;
  }

  // Explicit listing of any/all states the traffic light
  // should cycle through. Essentially, the instruction set.
  private static getLightCycle(): LightState[] {
    return [
      {
        duration: 22,
        signal: {
          [Face.North]: {
            right: Signal.Green,
            primary: Signal.Green,
            left: Signal.Flashing,
          },
          [Face.East]: {
            right: Signal.Red,
            primary: Signal.Red,
            left: Signal.Red,
          },
          [Face.South]: {
            right: Signal.Green,
            primary: Signal.Green,
            left: Signal.Flashing,
          },
          [Face.West]: {
            right: Signal.Red,
            primary: Signal.Red,
            left: Signal.Red,
          },
        },
      },
      {
        duration: 10,
        signal: {
          [Face.North]: {
            right: Signal.Yellow,
            primary: Signal.Yellow,
            left: Signal.Yellow,
          },
          [Face.East]: {
            right: Signal.Red,
            primary: Signal.Red,
            left: Signal.Red,
          },
          [Face.South]: {
            right: Signal.Yellow,
            primary: Signal.Yellow,
            left: Signal.Yellow,
          },
          [Face.West]: {
            right: Signal.Red,
            primary: Signal.Red,
            left: Signal.Red,
          },
        },
      },
      {
        duration: 16,
        signal: {
          [Face.North]: {
            right: Signal.Red,
            primary: Signal.Red,
            left: Signal.Green,
          },
          [Face.East]: {
            right: Signal.Red,
            primary: Signal.Red,
            left: Signal.Red,
          },
          [Face.South]: {
            right: Signal.Red,
            primary: Signal.Red,
            left: Signal.Green,
          },
          [Face.West]: {
            right: Signal.Red,
            primary: Signal.Red,
            left: Signal.Red,
          },
        },
      },
      {
        duration: 10,
        signal: {
          [Face.North]: {
            right: Signal.Red,
            primary: Signal.Red,
            left: Signal.Yellow,
          },
          [Face.East]: {
            right: Signal.Red,
            primary: Signal.Red,
            left: Signal.Red,
          },
          [Face.South]: {
            right: Signal.Red,
            primary: Signal.Red,
            left: Signal.Yellow,
          },
          [Face.West]: {
            right: Signal.Red,
            primary: Signal.Red,
            left: Signal.Red,
          },
        },
      },
      {
        duration: 22,
        signal: {
          [Face.North]: {
            right: Signal.Red,
            primary: Signal.Red,
            left: Signal.Red,
          },
          [Face.East]: {
            right: Signal.Green,
            primary: Signal.Green,
            left: Signal.Flashing,
          },
          [Face.South]: {
            right: Signal.Red,
            primary: Signal.Red,
            left: Signal.Red,
          },
          [Face.West]: {
            right: Signal.Green,
            primary: Signal.Green,
            left: Signal.Flashing,
          },
        },
      },
      {
        duration: 10,
        signal: {
          [Face.North]: {
            right: Signal.Red,
            primary: Signal.Red,
            left: Signal.Red,
          },
          [Face.East]: {
            right: Signal.Yellow,
            primary: Signal.Yellow,
            left: Signal.Yellow,
          },
          [Face.South]: {
            right: Signal.Red,
            primary: Signal.Red,
            left: Signal.Red,
          },
          [Face.West]: {
            right: Signal.Yellow,
            primary: Signal.Yellow,
            left: Signal.Yellow,
          },
        },
      },
      {
        duration: 16,
        signal: {
          [Face.North]: {
            right: Signal.Red,
            primary: Signal.Red,
            left: Signal.Red,
          },
          [Face.East]: {
            right: Signal.Red,
            primary: Signal.Red,
            left: Signal.Green,
          },
          [Face.South]: {
            right: Signal.Red,
            primary: Signal.Red,
            left: Signal.Red,
          },
          [Face.West]: {
            right: Signal.Red,
            primary: Signal.Red,
            left: Signal.Green,
          },
        },
      },
      {
        duration: 10,
        signal: {
          [Face.North]: {
            right: Signal.Red,
            primary: Signal.Red,
            left: Signal.Red,
          },
          [Face.East]: {
            right: Signal.Red,
            primary: Signal.Red,
            left: Signal.Yellow,
          },
          [Face.South]: {
            right: Signal.Red,
            primary: Signal.Red,
            left: Signal.Red,
          },
          [Face.West]: {
            right: Signal.Red,
            primary: Signal.Red,
            left: Signal.Yellow,
          },
        },
      },
    ];
  }

  // Traffic Light states to cycle through when Cross Walk requested
  private getCrossWalkCycle(face: Face): LightState[] {
    const { signal } = this.currentState();
    const { faces, oppFaces } = [Face.North, Face.South].includes(face)
      ? { faces: [Face.North, Face.South], oppFaces: [Face.East, Face.West] }
      : { faces: [Face.East, Face.West], oppFaces: [Face.North, Face.South] };
    const states: LightState[] = [];

    const xSig = signal[Face.East];
    const ySig = signal[Face.North];
    const nextSig = (sig: Signal) => {
      if ([Signal.Red, Signal.Yellow].includes(sig)) {
        return Signal.Red;
      } else {
        return Signal.Yellow;
      }
    };

    const hasGreenLight = [
      xSig.primary,
      xSig.left,
      xSig.right,
      ySig.primary,
      ySig.left,
      ySig.right,
    ].includes(Signal.Green);

    if (hasGreenLight) {
      states.push({
        duration: 10,
        signal: {
          [Face.North]: {
            right: nextSig(ySig.right),
            primary: nextSig(ySig.primary),
            left: nextSig(ySig.left),
          },
          [Face.East]: {
            right: nextSig(xSig.right),
            primary: nextSig(xSig.primary),
            left: nextSig(xSig.left),
          },
          [Face.South]: {
            right: nextSig(ySig.right),
            primary: nextSig(ySig.primary),
            left: nextSig(ySig.left),
          },
          [Face.West]: {
            right: nextSig(xSig.right),
            primary: nextSig(xSig.primary),
            left: nextSig(xSig.left),
          },
        },
      });
    }
    return states.concat(
      {
        duration: 22,
        signal: {
          [faces[0] as Face.North]: {
            right: Signal.Red,
            primary: Signal.Red,
            left: Signal.Red,
          },
          [oppFaces[0] as Face.East]: {
            right: Signal.Red,
            primary: Signal.Green,
            left: Signal.Red,
          },
          [faces[1] as Face.South]: {
            right: Signal.Red,
            primary: Signal.Red,
            left: Signal.Red,
          },
          [oppFaces[1] as Face.West]: {
            right: Signal.Red,
            primary: Signal.Green,
            left: Signal.Red,
          },
        },
      },
      {
        duration: 10,
        signal: {
          [faces[0] as Face.North]: {
            right: Signal.Red,
            primary: Signal.Red,
            left: Signal.Red,
          },
          [oppFaces[0] as Face.East]: {
            right: Signal.Red,
            primary: Signal.Yellow,
            left: Signal.Red,
          },
          [faces[1] as Face.South]: {
            right: Signal.Red,
            primary: Signal.Red,
            left: Signal.Red,
          },
          [oppFaces[1] as Face.West]: {
            right: Signal.Red,
            primary: Signal.Yellow,
            left: Signal.Red,
          },
        },
      }
    );
  }
}
