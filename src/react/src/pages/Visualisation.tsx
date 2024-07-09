import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import TemperatureGraph from "@/components/wrappers/TemperatureGraph/TemperatureGraph";
import { TemperatureDataContext } from "@/context/TemperatureDataContext";
import { useContext, useEffect, useState } from "react";

const MS_IN_SECOND = 1000 as const;

const Visualisation = () => {
  const [rawTemperatureJson, setRawTemperatureJson] = useState<
    string | undefined
  >(undefined);

  const {
    temperatureValues,
    setTemperatureValues,
    currentTemperatureIndex,
    setCurrentTemperatureIndex,
    isPlaying,
    setIsPlaying,
    deltaT,
    setDeltaT,
  } = useContext(TemperatureDataContext);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        if (currentTemperatureIndex < temperatureValues.length - 1) {
          setCurrentTemperatureIndex?.(currentTemperatureIndex + 1);
        } else {
          setCurrentTemperatureIndex?.(0);
          setIsPlaying?.(false);
        }
      }, deltaT * MS_IN_SECOND);
    }
    return () => clearInterval(interval);
  }, [
    currentTemperatureIndex,
    isPlaying,
    deltaT,
    temperatureValues,
    setCurrentTemperatureIndex,
    setIsPlaying,
  ]);

  return (
    <div className="w-full flex flex-col gap-4">
      {temperatureValues.length > 0 ? (
        <TemperatureGraph
          data={temperatureValues}
          currentTimestamp={
            Math.round(currentTemperatureIndex * deltaT * 100) / 100
          }
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
                setRawTemperatureJson(e.target?.result as string);
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
            onChange={(e) => setDeltaT?.(e.target.valueAsNumber)}
            type="number"
            min={0}
            defaultValue={0.05}
            id="timestep-input"
          />
        </span>
      </span>

      <Textarea
        placeholder="No temperature profile JSON"
        value={rawTemperatureJson}
        disabled
      />
      <span className="gap-2 flex">
        <Button
          disabled={!temperatureValues || isPlaying}
          onClick={() => {
            if (rawTemperatureJson) {
              setTemperatureValues?.(JSON.parse(rawTemperatureJson));
              setIsPlaying?.(true);
            }
          }}
        >
          Start
        </Button>
        <Button
          disabled={!!temperatureValues && !isPlaying}
          onClick={() => setIsPlaying?.(false)}
        >
          Stop
        </Button>
      </span>
    </div>
  );
};

export default Visualisation;
