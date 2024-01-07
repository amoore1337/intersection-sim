import { randomNum } from "../utils";
import { Grid } from "./grid";
import { Face, Road } from "./road";
import { simulation } from "./simulation";
import { TrafficLight } from "./trafficLight";
import { Vehicle } from "./vehicle";

export class Intersection {
  public readonly roads: Record<Face, Road>;
  public readonly grid: Grid = new Grid();
  public readonly trafficLight: TrafficLight = new TrafficLight();
  public readonly laneLength: number;
  private onTick = this.addVehicle.bind(this);
  private currentTickCount: number = 0;

  constructor() {
    this.laneLength = (this.grid.size - 4 * 2) / 2;
    this.roads = {
      [Face.North]: new Road(this, Face.North),
      [Face.East]: new Road(this, Face.East),
      [Face.South]: new Road(this, Face.South),
      [Face.West]: new Road(this, Face.West),
    };
    simulation.addOnTick(this.onTick);
  }

  clear() {
    this.clearVehicles();
  }

  private addVehicle() {
    if (
      Vehicle.globVehicleCount < simulation.getMaxVehicles() &&
      this.currentTickCount >= 1
    ) {
      const availableRoads = Object.values(this.roads);
      const roadIndex = randomNum(availableRoads.length - 1);
      availableRoads[roadIndex].addVehicle();
      this.currentTickCount = 0;
    } else {
      this.currentTickCount++;
    }
  }

  private clearVehicles() {
    Vehicle.globVehicleCount = 0;
  }
}
