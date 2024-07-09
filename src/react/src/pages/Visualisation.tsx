import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import TemperatureGraph from "@/components/wrappers/TemperatureGraph/TemperatureGraph";
import { TemperatureGraphDataPoint } from "@/models/Graph";
import { useEffect, useState } from "react";

const Visualisation = () => {
  const [graphData, setGraphData] = useState<TemperatureGraphDataPoint[]>([]);
  const [currentProfile, setCurrentProfile] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {});

  return (
    <div className="w-full flex flex-col gap-4">
      {graphData.length > 0 ? (
        <TemperatureGraph data={graphData} />
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
      </span>

      <Textarea
        placeholder="Enter the temperature profile"
        value={currentProfile}
        disabled
      />
      <Button
        disabled={!currentProfile}
        onClick={() => {
          if (currentProfile) {
            setGraphData(JSON.parse(currentProfile));
          }
        }}
      >
        Start
      </Button>
    </div>
  );
};

export default Visualisation;
