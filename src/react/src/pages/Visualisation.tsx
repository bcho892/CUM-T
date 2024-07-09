import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import TemperatureGraph from "@/components/wrappers/TemperatureGraph/TemperatureGraph";
import { TemperatureGraphDataPoint } from "@/models/Graph";
import { useEffect, useState } from "react";

const DEFAULT_DELTA_T = 0.05 as const;
const MS_IN_SECOND = 1000 as const;

const Visualisation = () => {
  const [graphData, setGraphData] = useState<TemperatureGraphDataPoint[]>([]);
  const [currentProfile, setCurrentProfile] = useState<string | undefined>(
    undefined,
  );

  const [deltaT, setDeltaT] = useState<number>(DEFAULT_DELTA_T);

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [start, setStart] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (start) {
      interval = setInterval(() => {
        if (currentIndex < graphData.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setCurrentIndex(0);
          setStart(false);
        }
      }, deltaT * MS_IN_SECOND);
    }
    return () => clearInterval(interval);
  }, [currentIndex, start, deltaT, graphData]);

  return (
    <div className="w-full flex flex-col gap-4">
      {graphData.length > 0 ? (
        <TemperatureGraph
          data={graphData}
          currentTimestamp={Math.round(currentIndex * deltaT * 100) / 100}
        />
      ) : (
        <>
          <h2>Load a temperature profile</h2>
          <p>Either generate a profile or make your own</p>
        </>
      )}
      <span className="flex gap-2 items-end">
        <span>
          <Label htmlFor="upload">Upload File</Label>
          <Input
            id="upload"
            type="file"
            accept=".json"
            onChange={(e) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                setCurrentProfile(e.target?.result as string);
              };
              if (e.target.files) {
                reader.readAsText(e.target?.files[0]);
              }
            }}
          />
        </span>

        <span>
          <Label htmlFor="timestep-input">Set Timestep</Label>
          <Input
            onChange={(e) => setDeltaT(e.target.valueAsNumber)}
            type="number"
            min={0}
            defaultValue={0.05}
            id="timestep-input"
          />
        </span>
      </span>

      <Textarea
        placeholder="No temperature profile JSON"
        value={currentProfile}
        disabled
      />
      <span className="gap-2 flex">
        <Button
          disabled={!currentProfile || start}
          onClick={() => {
            if (currentProfile) {
              setGraphData(JSON.parse(currentProfile));
              setStart(true);
            }
          }}
        >
          Start
        </Button>
        <Button
          disabled={!!currentProfile && !start}
          onClick={() => setStart(false)}
        >
          Stop
        </Button>
      </span>
    </div>
  );
};

export default Visualisation;
