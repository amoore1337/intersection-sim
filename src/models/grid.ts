import { simulation } from "./simulation";
import { Vehicle } from "./vehicle";

export interface GridLoc {
  x: number;
  y: number;
}

export interface GridState {
  [y: number]: { [x: number]: Vehicle };
}

export class Grid {
  public readonly size: number = simulation.GRID_SIZE;
  public readonly maxIndex: number = this.size - 1;
  // Meh, tempted to make `cells` a two-deminsional array similar
  // to what we return for the UI. But the flat object makes for
  // convenient/fast lookups so leaving for now.
  private cells: Record<string, Vehicle> = {};

  getVehicle(loc: GridLoc) {
    return this.cells[this.locIndex(loc)];
  }

  getGrid() {
    return Object.keys(this.cells).reduce<GridState>((acc, curr) => {
      const { x, y } = this.parseLocIndex(curr);
      const vehicle = this.cells[curr];
      return { ...acc, [y]: { ...acc[y], [x]: vehicle } };
    }, {});
  }

  vehicleCount() {
    return Object.keys(this.cells).length;
  }

  // Moves vehicle to the target location if location
  // is in-bounds and there isn't a vehicle already there.
  moveToCell(vehicle: Vehicle, targetLoc: GridLoc) {
    if (this.getVehicle(targetLoc)) {
      return false;
    }

    delete this.cells[this.locIndex(vehicle.location)];
    // If requested index is off the board, skip adding
    if (!this.locOutOfBounds(targetLoc)) {
      this.cells[this.locIndex(targetLoc)] = vehicle;
      return true;
    }
    return false;
  }

  emptyCell(loc: GridLoc) {
    delete this.cells[this.locIndex(loc)];
  }

  locOutOfBounds(loc: GridLoc) {
    return Object.values(loc).some((pos) => pos < 0 || pos > this.maxIndex);
  }

  // Create `cells` key from location object
  private locIndex(loc: GridLoc) {
    return `${loc.x},${loc.y}`;
  }

  // Parses `cells` key back into location object
  private parseLocIndex(index: string): GridLoc {
    const [x, y] = index.split(",");
    return { x: parseInt(x), y: parseInt(y) };
  }
}
