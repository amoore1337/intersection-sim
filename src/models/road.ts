import { randomNum } from "../utils";
import { GridLoc } from "./grid";
import { Intersection } from "./intersection";
import { Direction, Lane } from "./lane";

export enum Face {
  North = "north",
  East = "east",
  South = "south",
  West = "west",
}

export class Road {
  public readonly lanes: Lane[];
  public readonly axis: keyof GridLoc;
  public opperator: 1 | -1;

  constructor(
    public readonly intersection: Intersection,
    public readonly face: Face
  ) {
    this.axis = [Face.North, Face.South].includes(face) ? "y" : "x";
    this.opperator = [Face.South, Face.East].includes(face) ? 1 : -1;
    this.lanes = [
      new Lane(this, Direction.Left, 3),
      new Lane(this, Direction.Straight, 2),
      new Lane(this, Direction.Straight, 1),
      new Lane(this, Direction.Right, 0),
    ] as const;
  }

  addVehicle() {
    const laneIndex = randomNum(this.lanes.length - 1);
    this.lanes[laneIndex].addVehicle();
  }
}
