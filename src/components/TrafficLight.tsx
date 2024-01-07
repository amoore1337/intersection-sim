import { ReactNode, useEffect, useState } from "react";
import { Intersection } from "../models/intersection";
import { LightState, Signal } from "../models/trafficLight";
import clsx from "clsx";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from "@radix-ui/react-icons";

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
          <Light
            color={lightState.signal.north.right}
            icon={<ArrowLeftIcon width={10} height={10} />}
          />
          <Light
            color={lightState.signal.north.primary}
            icon={<ArrowDownIcon width={10} height={10} />}
          />
          <Light
            color={lightState.signal.north.primary}
            icon={<ArrowDownIcon width={10} height={10} />}
          />
          <Light
            color={lightState.signal.north.left}
            icon={<ArrowRightIcon width={10} height={10} />}
          />
        </div>
        {/* EAST */}
        <div className="absolute inset-y-0 right-0.5 flex flex-col justify-center items-center gap-2">
          <Light
            color={lightState.signal.east.right}
            icon={<ArrowUpIcon width={10} height={10} />}
          />
          <Light
            color={lightState.signal.east.primary}
            icon={<ArrowLeftIcon width={10} height={10} />}
          />
          <Light
            color={lightState.signal.east.primary}
            icon={<ArrowLeftIcon width={10} height={10} />}
          />
          <Light
            color={lightState.signal.east.left}
            icon={<ArrowDownIcon width={10} height={10} />}
          />
        </div>
        {/* SOUTH */}
        <div className="absolute inset-x-0 bottom-0.5 flex justify-center items-center gap-2">
          <Light
            color={lightState.signal.south.left}
            icon={<ArrowLeftIcon width={10} height={10} />}
          />
          <Light
            color={lightState.signal.south.primary}
            icon={<ArrowUpIcon width={10} height={10} />}
          />
          <Light
            color={lightState.signal.south.primary}
            icon={<ArrowUpIcon width={10} height={10} />}
          />
          <Light
            color={lightState.signal.south.right}
            icon={<ArrowRightIcon width={10} height={10} />}
          />
        </div>
        {/* WEST */}
        <div className="absolute inset-y-0 left-0.5 flex flex-col justify-center items-center gap-2">
          <Light
            color={lightState.signal.west.left}
            icon={<ArrowUpIcon width={10} height={10} />}
          />
          <Light
            color={lightState.signal.west.primary}
            icon={<ArrowRightIcon width={10} height={10} />}
          />
          <Light
            color={lightState.signal.west.primary}
            icon={<ArrowRightIcon width={10} height={10} />}
          />
          <Light
            color={lightState.signal.west.right}
            icon={<ArrowDownIcon width={10} height={10} />}
          />
        </div>
      </div>
    )
  );
}

function Light({ color, icon }: { color: Signal; icon?: ReactNode }) {
  const colorClass = {
    [Signal.Green]: "bg-green-500",
    [Signal.Yellow]: "bg-yellow-500",
    [Signal.Flashing]: "flash-yellow",
    [Signal.Red]: "bg-red-400",
  }[color];
  return (
    <span
      className={clsx(
        "rounded-full w-[15px] h-[15px] flex items-center justify-center text-white",
        colorClass
      )}
      children={icon}
    />
  );
}
