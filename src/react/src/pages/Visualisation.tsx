import { Button } from "@/components/ui/button";
import TemperatureGraph from "@/components/wrappers/TemperatureGraph/TemperatureGraph";
import { TemperatureGraphDataPoint } from "@/models/Graph";
import { useState } from "react";

const Visualisation = () => {
  const [graphData, setGraphData] = useState<TemperatureGraphDataPoint[]>([]);
  return (
    <div className="w-full">
      {graphData.length > 0 ? (
        <TemperatureGraph data={graphData} />
      ) : (
        <h2>Load a temperature profile</h2>
      )}
      <span className="flex gap-2">
        <Button>Start</Button>
        <Button>Load New</Button>
      </span>
    </div>
  );
};

export default Visualisation;
