import { useState } from "react";
import { Intersection } from "./models/intersection";
import { TrafficLight } from "./components/TrafficLight";
import { Grid } from "./components/Grid";
import { simulation } from "./models/simulation";
import { Controls } from "./components/Controls";

function App() {
  const [intersection, setIntersection] = useState<Intersection>();

  return (
    <div className="relative h-screen w-screen flex flex-col text-gray-800 overflow-auto">
      <div className="w-full p-4 flex gap-2 items-center">
        <h1 className="text-lg font-semibold mr-4">Intersection Sim</h1>
        <Controls
          running={!!intersection}
          onStop={() => setIntersection(simulation.getIntersection())}
        />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="relative inline-block">
          <div className="absolute right-full pr-8">
            {intersection && <TrafficLight intersection={intersection} />}
          </div>
          <Grid intersection={intersection} />
        </div>
      </div>
    </div>
  );
}

export default App;
