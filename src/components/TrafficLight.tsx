import { useEffect, useState } from "react";
import { Intersection } from "../models/intersection";
import { LightState, Signal } from "../models/trafficLight";

interface Props {
  intersection: Intersection;
}

export function TrafficLight({ intersection }: Props) {
  const [lightState, setCurrentLight] = useState<LightState>();

  useEffect(() => {
    intersection.trafficLight.setOnLightChange(setCurrentLight);
  }, [intersection]);

  return (
    lightState && (
      <div className="w-[120px] h-[120px] rounded border border-solid border-gray-800 relative bg-white">
        {/* NORTH */}
        <div className="absolute inset-x-0 top-0.5 flex justify-center items-center gap-2">
          <Light color={lightState.signal.north.right} />
          <Light color={lightState.signal.north.primary} />
          <Light color={lightState.signal.north.primary} />
          <Light color={lightState.signal.north.left} />
        </div>
        {/* EAST */}
        <div className="absolute inset-y-0 right-0.5 flex flex-col justify-center items-center gap-2">
          <Light color={lightState.signal.east.right} />
          <Light color={lightState.signal.east.primary} />
          <Light color={lightState.signal.east.primary} />
          <Light color={lightState.signal.east.left} />
        </div>
        {/* SOUTH */}
        <div className="absolute inset-x-0 bottom-0.5 flex justify-center items-center gap-2">
          <Light color={lightState.signal.south.left} />
          <Light color={lightState.signal.south.primary} />
          <Light color={lightState.signal.south.primary} />
          <Light color={lightState.signal.south.right} />
        </div>
        {/* WEST */}
        <div className="absolute inset-y-0 left-0.5 flex flex-col justify-center items-center gap-2">
          <Light color={lightState.signal.west.left} />
          <Light color={lightState.signal.west.primary} />
          <Light color={lightState.signal.west.primary} />
          <Light color={lightState.signal.west.right} />
        </div>
      </div>
    )
  );
}

function Light({ color }: { color: Signal }) {
  const colorClass = {
    [Signal.Green]: "bg-green-500",
    [Signal.Yellow]: "bg-yellow-500",
    [Signal.Flashing]: "flash-yellow",
    [Signal.Red]: "bg-red-400",
  }[color];
  return <span className={`rounded-full w-[15px] h-[15px] ${colorClass}`} />;
}
