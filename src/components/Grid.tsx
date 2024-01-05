import { useEffect, useState } from "react";
import { simulation } from "../models/simulation";
import { Intersection } from "../models/intersection";
import { GridState } from "../models/grid";

interface Props {
  intersection: Intersection | undefined;
}

export function Grid({ intersection }: Props) {
  const [grid, setGrid] = useState<GridState>();

  useEffect(() => {
    if (!intersection) {
      setGrid(undefined);
      return;
    }

    const handleTick = () => {
      setGrid(intersection?.grid.getGrid());
    };
    simulation.addOnTick(handleTick);

    return () => {
      simulation.removeOnTick(handleTick);
    };
  }, [intersection]);

  return (
    <div className="relative">
      <table className="border border-gray-800 rounded border-spacing-2 border-separate">
        <tbody>
          {[...Array(simulation.GRID_SIZE)].map((_, y) => (
            <tr key={y}>
              {[...Array(simulation.GRID_SIZE)].map((_, x) => {
                const vehicle = grid?.[y]?.[x];
                return (
                  <td
                    key={x}
                    className="border border-gray-300 rounded w-[20px] h-[20px] relative"
                  >
                    <VehicleChip active={!!vehicle} color={vehicle?.color} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <Overlay />
    </div>
  );
}

function Overlay() {
  const laneLength = simulation.getIntersection()?.laneLength;
  if (!laneLength) {
    return <></>;
  }

  const percentSize = (laneLength / simulation.GRID_SIZE) * 100;

  return (
    <div className="absolute w-full h-full top-0 left-0">
      <div
        className="absolute top-0 left-0 border-r border-b border-gray-800"
        style={{
          width: `${percentSize}%`,
          height: `${percentSize}%`,
        }}
      />
      <div
        className="absolute top-0 right-0 border-l border-b border-gray-800"
        style={{
          width: `${percentSize}%`,
          height: `${percentSize}%`,
        }}
      />
      <div
        className="absolute bottom-0 left-0 border-r border-t border-gray-800"
        style={{
          width: `${percentSize}%`,
          height: `${percentSize}%`,
        }}
      />
      <div
        className="absolute bottom-0 right-0 border-l border-t border-gray-800"
        style={{
          width: `${percentSize}%`,
          height: `${percentSize}%`,
        }}
      />
      <div
        className="absolute border-r border-gray-800 top-0 left-1/2"
        style={{ height: `${percentSize}%` }}
      />
      <div
        className="absolute border-r border-gray-800 bottom-0 left-1/2"
        style={{ height: `${percentSize}%` }}
      />
      <div
        className="absolute border-b border-gray-800 left-0 top-1/2"
        style={{ width: `${percentSize}%` }}
      />
      <div
        className="absolute border-b border-gray-800 right-0 top-1/2"
        style={{ width: `${percentSize}%` }}
      />
    </div>
  );
}

function VehicleChip({
  active,
  color,
}: {
  active: boolean;
  color: string | undefined;
}) {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div
        className="w-[10px] h-[10px] rounded-sm"
        style={{ backgroundColor: active ? color : "" }}
      />
    </div>
  );
}
