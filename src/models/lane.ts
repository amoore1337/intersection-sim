import { GridLoc } from "./grid";
import { Face, Road } from "./road";
import { Vehicle } from "./vehicle";

export enum Direction {
  Left = "left",
  Right = "right",
  Straight = "straight",
}

export class Lane {
  public readonly startLoc: GridLoc;
  public readonly endLoc: GridLoc;
  public readonly destinationLoc: GridLoc;

  constructor(
    public readonly road: Road,
    public readonly direction: Direction,
    private position: number
  ) {
    this.startLoc = this.calcStartLoc();
    this.endLoc = this.calcEndLoc();
    this.destinationLoc = this.calcDestination();
  }

  addVehicle() {
    const grid = this.road.intersection.grid;
    if (grid.getVehicle(this.startLoc)) {
      return;
    }

    new Vehicle(
      this.road.intersection.trafficLight,
      this.road.intersection.grid,
      this
    );
  }

  isLocInLane(loc: GridLoc) {
    const face = this.road.face;

    switch (face) {
      case Face.North:
        return loc.x === this.endLoc.x && loc.y >= this.endLoc.y;
      case Face.East:
        return loc.x <= this.endLoc.x && loc.y === this.endLoc.y;
      case Face.South:
        return loc.x === this.endLoc.x && loc.y <= this.endLoc.y;
      case Face.West:
        return loc.x >= this.endLoc.x && loc.y === this.endLoc.y;
    }
  }

  private calcStartLoc(): GridLoc {
    const laneLength = this.road.intersection.laneLength;
    const grid = this.road.intersection.grid;
    const face = this.road.face;

    switch (face) {
      case Face.North:
        return {
          x: grid.maxIndex - laneLength - this.position,
          y: grid.maxIndex,
        };
      case Face.East:
        return { x: 0, y: grid.maxIndex - laneLength - this.position };
      case Face.South:
        return { x: laneLength + this.position, y: 0 };
      case Face.West:
        return {
          x: grid.maxIndex,
          y: laneLength + this.position,
        };
    }
  }

  private calcEndLoc(): GridLoc {
    const laneLength = this.road.intersection.laneLength;
    const grid = this.road.intersection.grid;
    const face = this.road.face;

    switch (face) {
      case Face.North:
        return {
          x: grid.maxIndex - laneLength - this.position,
          y: grid.maxIndex - laneLength + 1,
        };
      case Face.East:
        return {
          x: laneLength - 1,
          y: grid.maxIndex - laneLength - this.position,
        };
      case Face.South:
        return { x: laneLength + this.position, y: laneLength - 1 };
      case Face.West:
        return {
          x: grid.maxIndex - laneLength + 1,
          y: laneLength + this.position,
        };
    }
  }

  private calcDestination(): GridLoc {
    const face = this.road.face;
    const laneLength = this.road.intersection.laneLength;
    const grid = this.road.intersection.grid;
    const start = this.calcStartLoc();
    const targetLanePosition = {
      [Direction.Left]: 3,
      [Direction.Straight]: this.position,
      [Direction.Right]: 0,
    }[this.direction];

    switch (face) {
      case Face.North:
        return {
          [Direction.Left]: { x: 0, y: laneLength + targetLanePosition },
          [Direction.Straight]: { x: start.x, y: 0 },
          [Direction.Right]: {
            x: grid.maxIndex,
            y: grid.maxIndex - laneLength - targetLanePosition,
          },
        }[this.direction];
      case Face.East:
        return {
          [Direction.Left]: {
            x: laneLength + targetLanePosition + 1,
            y: 0,
          },
          [Direction.Straight]: { x: grid.maxIndex, y: start.y },
          [Direction.Right]: {
            x: laneLength + targetLanePosition,
            y: grid.maxIndex,
          },
        }[this.direction];
      case Face.South:
        return {
          [Direction.Left]: {
            x: grid.maxIndex,
            y: grid.maxIndex - laneLength - targetLanePosition,
          },
          [Direction.Straight]: { x: start.x, y: grid.maxIndex },
          [Direction.Right]: { x: 0, y: laneLength + targetLanePosition },
        }[this.direction];
      case Face.West:
        return {
          [Direction.Left]: {
            x: grid.maxIndex - laneLength - targetLanePosition - 1,
            y: grid.maxIndex,
          },
          [Direction.Straight]: { x: 0, y: start.y },
          [Direction.Right]: {
            x: grid.maxIndex - laneLength - targetLanePosition,
            y: 0,
          },
        }[this.direction];
    }
  }
}
