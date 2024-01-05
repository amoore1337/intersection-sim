import clsx from "clsx";
import { defaultSettings, simulation } from "../models/simulation";
import { useEffect, useState } from "react";
import { Face } from "../models/road";

interface Props {
  running: boolean;
  onStop: () => void;
}

export function Controls({ running, onStop }: Props) {
  const [paused, setPaused] = useState(false);
  const [maxVehicles, setMaxVehicles] = useState(
    defaultSettings.maxVehicles.toString()
  );

  const handlePlayStop = () => {
    if (simulation.isRunning()) {
      simulation.stop();
    } else {
      const vehicles = parseInt(maxVehicles);
      simulation.start({
        maxVehicles: isNaN(vehicles) ? undefined : vehicles,
      });
    }
    onStop();
  };

  const handlePause = () => {
    if (paused) {
      simulation.resume();
      setPaused(false);
    } else {
      simulation.pause();
      setPaused(true);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={handlePlayStop}
        className={clsx("rounded text-sm px-3 py-1 border", {
          "bg-red-200 hover:bg-red-300 border-red-900 text-red-900": running,
          "bg-green-200 hover:bg-green-300 border-green-900 text-green-900":
            !running,
        })}
      >
        {running ? "Stop" : "Play"}
      </button>
      {running && (
        <button
          onClick={handlePause}
          className={clsx("rounded text-sm px-3 py-1 border", {
            "bg-sky-200 hover:bg-sky-300 text-sky-900 border-sky-900": !paused,
            "bg-green-200 hover:bg-green-300 border-green-900 text-green-900":
              paused,
          })}
        >
          {paused ? "Resume" : "Pause"}
        </button>
      )}
      {running && <CrossWalkButton face={Face.North} />}
      {running && <CrossWalkButton face={Face.East} />}
      {!running && (
        <div>
          <label htmlFor="maxVehicles" className="mr-1 text-sm">
            Max Vehicles:
          </label>
          <input
            id="maxVehicles"
            type="number"
            className="rounded text-sm border border-gray-800 px-2 py-1 w-[80px]"
            value={maxVehicles}
            onChange={({ target: { value } }) => setMaxVehicles(value)}
          />
        </div>
      )}
      {running && <VehicleCount />}
    </div>
  );
}

function VehicleCount() {
  const [count, setCount] = useState<number>();
  useEffect(() => {
    const handleTick = () =>
      setCount(simulation.getIntersection()?.grid.vehicleCount());

    simulation.addOnTick(handleTick);

    return () => {
      simulation.removeOnTick(handleTick);
    };
  }, []);

  return !!count && <div>Vehicles: {count}</div>;
}

function CrossWalkButton({ face }: { face: Face }) {
  const [requesting, setRequesting] = useState(false);

  const handleRequestCrossWalk = () => {
    simulation.getIntersection()?.trafficLight.requestCrossWalk(face);
    setRequesting(true);
  };

  useEffect(() => {
    if (requesting) {
      const timeout = setTimeout(() => setRequesting(false), 2000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [requesting]);

  const direction = [Face.North, Face.South].includes(face)
    ? "Vertical"
    : "Horizonal";

  return (
    <button
      onClick={handleRequestCrossWalk}
      className={clsx(
        "rounded text-sm px-3 py-1 border w-[220px]",
        "bg-yellow-200 hover:bg-yellow-300 text-yellow-900 border-yellow-900"
      )}
    >
      {requesting ? "Requested!" : `Request Walk Across ${direction}`}
    </button>
  );
}
