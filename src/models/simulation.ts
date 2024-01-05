import { Intersection } from "./intersection";

interface Settings {
  maxVehicles?: number;
}

export const defaultSettings = {
  maxVehicles: 50,
} as const satisfies Settings;

export class Simulation {
  public readonly TICK = 500 as const;
  public readonly GRID_SIZE = 18 as const;

  private maxVehicles: number = defaultSettings.maxVehicles;
  private intersection: Intersection | undefined;
  private running: boolean = false;
  private onTick: (() => void)[] = [];
  private currentTimer: number | undefined;

  addOnTick(onTick: () => void) {
    this.onTick.push(onTick);
  }

  removeOnTick(onTick: () => void) {
    const index = this.onTick.findIndex((cb) => cb === onTick);
    if (index > -1) {
      this.onTick.splice(index, 1);
    }
  }

  isRunning() {
    return this.running;
  }

  start(settings?: Settings) {
    if (this.running) {
      return;
    }
    clearTimeout(this.currentTimer);
    this.maxVehicles = settings?.maxVehicles ?? defaultSettings.maxVehicles;
    this.intersection = new Intersection();
    this.running = true;
    this.processTick();
  }

  stop() {
    clearTimeout(this.currentTimer);
    this.intersection?.clear();
    this.intersection = undefined;
    this.onTick = [];
    this.running = false;
  }

  pause() {
    clearTimeout(this.currentTimer);
    this.running = false;
  }

  resume() {
    if (this.running) {
      return;
    }
    clearTimeout(this.currentTimer);
    this.running = true;
    this.processTick();
  }

  processTick() {
    if (!this.running) {
      return;
    }
    this.currentTimer = setTimeout(() => {
      this.onTick.forEach((cb) => cb());
      this.processTick();
    }, this.TICK);
  }

  getIntersection() {
    return this.intersection;
  }

  getMaxVehicles() {
    return this.maxVehicles;
  }
}

const sim = (function simulationFactory() {
  let instance: Simulation;
  return {
    getInstance() {
      if (!instance) {
        instance = new Simulation();
      }
      return instance;
    },
  };
})();

export const simulation = sim.getInstance();
