import { useState } from "react";
import { Intersection } from "./models/intersection";
import { TrafficLight } from "./components/TrafficLight";
import { Grid } from "./components/Grid";
import { simulation } from "./models/simulation";
import { Controls } from "./components/Controls";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

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
        <a
          className="fixed bottom-2 right-2 text-gray-800 hover:text-sky-600"
          href="https://github.com/amoore1337/intersection-sim"
          target="_blank"
          aria-label="View on GitHub"
        >
          <GitHubLogoIcon width={40} height={40} />
        </a>
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
