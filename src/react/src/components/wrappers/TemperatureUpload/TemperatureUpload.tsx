import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TemperatureDataContext } from "@/context/TemperatureDataContext";
import { useCallback, useContext, useState } from "react";

const TemperatureUpload = () => {
  const [rawTemperatureJson, setRawTemperatureJson] = useState<
    string | undefined
  >(undefined);
  const {
    temperatureValues,
    setDeltaT,
    deltaT,
    isPlaying,
    setTemperatureValues,
    setIsPlaying,
  } = useContext(TemperatureDataContext);

  const inferDeltaT = useCallback(() => {
    if (temperatureValues.length > 1) {
      setDeltaT?.(temperatureValues[1].time - temperatureValues[0].time);
    }
  }, [temperatureValues, setDeltaT]);
  return (
    <>
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
            step={deltaT}
            min={0}
            value={deltaT}
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
              inferDeltaT();
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
    </>
  );
};

export default TemperatureUpload;
