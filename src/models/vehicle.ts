import { randomNum } from "../utils";
import { Grid, GridLoc } from "./grid";
import { Direction, Lane } from "./lane";
import { Face } from "./road";
import { simulation } from "./simulation";
import { Signal, TrafficLight } from "./trafficLight";
import { colors } from "../colors";

export class Vehicle {
  public static globVehicleCount = 0;
  public readonly name: string;
  public readonly color: string;
  public location: GridLoc;
  private static lastRecordIndex = 0;
  private onTick = this.processMovement.bind(this);

  constructor(
    private trafficLight: TrafficLight,
    private grid: Grid,
    private lane: Lane
  ) {
    this.name = `V-${Vehicle.lastRecordIndex}`;
    this.color = colors[randomNum(colors.length - 1)];
    this.location = lane.startLoc;
    Vehicle.globVehicleCount++;
    Vehicle.lastRecordIndex++;
    simulation.addOnTick(this.onTick);
  }

  private processMovement() {
    // We've completed our travel. Cleanup and delete.
    if (this.atDestination()) {
      this.exit();
      return;
    }

    // We still haven't moved up to the light.
    // We can safely move forward.
    const next = this.nextLoc();
    if (this.lane.isLocInLane(next)) {
      this.moveTo(next);
      return;
    }

    // We're alraedy in the intersection. Make sure it's safe to proceed.
    if (this.isInIntersection()) {
      if (this.shouldProceedInIntersection(next)) {
        this.moveTo(next);
      }
      return;
    }

    // We're through the intersection and to the other side.
    // Continue on to exit.
    if (!this.lane.isLocInLane(this.location)) {
      this.moveTo(next);
    }

    const face = this.lane.road.face;
    const direction = this.lane.direction;
    const { signal: light } = this.trafficLight.currentState();
    const signal = light[face];

    // We're moving into the intersection. Check the status of the signal
    const indicator = {
      [Direction.Left]: "left",
      [Direction.Straight]: "primary",
      [Direction.Right]: "right",
    }[direction] as keyof typeof signal;
    if ([Signal.Green, Signal.Flashing].includes(signal[indicator])) {
      this.moveTo(next);
    }
  }

  private nextLoc(fromLoc: GridLoc = this.location): GridLoc {
    const destLoc = this.lane.destinationLoc;
    const dir = this.lane.direction;
    const face = this.lane.road.face;

    switch (face) {
      case Face.North:
        if (fromLoc.y > destLoc.y) {
          return { x: fromLoc.x, y: fromLoc.y - 1 };
        } else if (dir === Direction.Left) {
          return { x: fromLoc.x - 1, y: fromLoc.y };
        } else {
          return { x: fromLoc.x + 1, y: fromLoc.y };
        }
      case Face.East:
        if (fromLoc.x < destLoc.x) {
          return { x: fromLoc.x + 1, y: fromLoc.y };
        } else if (dir === Direction.Left) {
          return { x: fromLoc.x, y: fromLoc.y - 1 };
        } else {
          return { x: fromLoc.x, y: fromLoc.y + 1 };
        }
      case Face.South:
        if (fromLoc.y < destLoc.y) {
          return { x: fromLoc.x, y: fromLoc.y + 1 };
        } else if (dir === Direction.Left) {
          return { x: fromLoc.x + 1, y: fromLoc.y };
        } else {
          return { x: fromLoc.x - 1, y: fromLoc.y };
        }
      case Face.West:
        if (fromLoc.x > destLoc.x) {
          return { x: fromLoc.x - 1, y: fromLoc.y };
        } else if (dir === Direction.Left) {
          return { x: fromLoc.x, y: fromLoc.y + 1 };
        } else {
          return { x: fromLoc.x, y: fromLoc.y - 1 };
        }
    }
  }

  private moveTo(target: GridLoc) {
    if (this.grid.moveToCell(this, target)) {
      this.location = target;
    }
  }

  private isInIntersection(loc: GridLoc = this.location) {
    const { min, max } = this.intersectionRange();
    return Object.values(loc).every((pos) => pos > min && pos < max);
  }

  // Max / Min indices of the square containing the actual intersection
  private intersectionRange() {
    const laneLength = this.lane.road.intersection.laneLength;
    return {
      min: laneLength - 1,
      max: this.grid.size - laneLength,
    };
  }

  // Rules for moving within the intersection
  private shouldProceedInIntersection(nextLoc: GridLoc) {
    if (this.lane.direction === Direction.Left) {
      const startLoc = this.lane.startLoc;
      const face = this.lane.road.face;
      const hasNotTurned = [Face.North, Face.South].includes(face)
        ? startLoc.x === nextLoc.x
        : startLoc.y === nextLoc.y;
      if (hasNotTurned) {
        // If we're prepping to make a left turn, leave a gap
        // with the Vehicle ahead of us to prevent clogging.
        const forwardPos: GridLoc = {
          [Face.North]: { x: nextLoc.x, y: nextLoc.y - 1 },
          [Face.East]: { x: nextLoc.x + 1, y: nextLoc.y },
          [Face.South]: { x: nextLoc.x, y: nextLoc.y + 1 },
          [Face.West]: { x: nextLoc.x - 1, y: nextLoc.y },
        }[face];

        if (this.grid.getVehicle(forwardPos)) {
          return false;
        }
      }
      const { signal: light } = this.trafficLight.currentState();
      const signal = light[face];
      if (signal.left === Signal.Flashing && this.hasOpposingTraffic(nextLoc)) {
        return false;
      }
    }
    // If we're not making a left turn, keep moving to get out of the way!
    return true;
  }

  private hasOpposingTraffic(nextLoc: GridLoc) {
    // Only worry about incoming traffic if making left turn
    if (this.lane.direction !== Direction.Left) {
      return false;
    }
    const face = this.lane.road.face;
    const oppAxis: keyof GridLoc = this.lane.road.axis === "x" ? "y" : "x";
    const aboutToTurn =
      Math.abs(this.lane.startLoc[oppAxis] - nextLoc[oppAxis]) === 1;

    if (!aboutToTurn) {
      return false;
    }

    const intersection = this.lane.road.intersection;
    const opposingRoad = {
      [Face.North]: intersection.roads[Face.South],
      [Face.East]: intersection.roads[Face.West],
      [Face.South]: intersection.roads[Face.North],
      [Face.West]: intersection.roads[Face.East],
    }[face];

    // Check 'straight' lanes of opposing roads to see if any
    // vehicles are oncoming/in intersection
    return opposingRoad.lanes
      .filter((l) => l.direction === Direction.Straight)
      .some((lane) => {
        const plane = lane.endLoc[oppAxis];
        const start = lane.endLoc[opposingRoad.axis];
        const end = this.location[opposingRoad.axis] - 1;
        return [...Array(Math.abs(end - start))].some(
          (_, index) =>
            !!this.grid.getVehicle({
              [oppAxis as "x"]: plane,
              [opposingRoad.axis as "y"]:
                start + index * opposingRoad.opperator,
            })
        );
      });
  }

  private atDestination() {
    if (this.grid.locOutOfBounds(this.location)) {
      return true;
    }
    const dest = this.lane.destinationLoc;
    return dest.x === this.location.x && dest.y === this.location.y;
  }

  private exit() {
    this.grid.emptyCell(this.location);
    simulation.removeOnTick(this.onTick);
    Vehicle.globVehicleCount--;
  }

  toString() {
    return `
      Vehicle ${this.name};\n
      ${this.lane.road.face} bound lane going ${this.lane.direction};\n
      Current Pos: ${this.location.x}, ${this.location.y};\n
      Lane Ends At: ${this.lane.endLoc.x}, ${this.lane.endLoc.y}\n
      Destination Pos: ${this.lane.destinationLoc.x}, ${this.lane.destinationLoc.y}
    `;
  }
}
