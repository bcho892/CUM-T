import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { TemperatureDataContext } from "@/context/TemperatureDataContext";
import { useCallback, useContext, useMemo, useState } from "react";

type Mode = "raw-temperature" | "raw-arousal";

const RawArousalUpload = () => {
  const {
    temperatureValues,
    setDeltaT,
    deltaT,
    isPlaying,
    setArousalValueDataPoints,
    setIsPlaying,
  } = useContext(TemperatureDataContext);

  const [rawArousalValues, setRawArousalValues] = useState<
    string | undefined
  >();

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
                setRawArousalValues(e.target?.result as string);
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
        placeholder="No raw arousal JSON"
        value={rawArousalValues}
        disabled
      />
      <span className="gap-2 flex">
        <Button
          disabled={!temperatureValues || isPlaying}
          onClick={() => {
            if (rawArousalValues) {
              setArousalValueDataPoints?.(JSON.parse(rawArousalValues));
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

const TemperatureUpload = () => {
  const [currentMode, setCurrentMode] = useState<Mode>("raw-temperature");

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

  const RawTemperatureUpload = useMemo(
    () => (
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
    ),
    [
      inferDeltaT,
      rawTemperatureJson,
      temperatureValues,
      setDeltaT,
      deltaT,
      isPlaying,
      setTemperatureValues,
      setIsPlaying,
    ],
  );
  return (
    <>
      <div className="flex items-center space-x-2 my-2">
        <Switch
          id="mode-switch"
          onCheckedChange={(checked) =>
            setCurrentMode(checked ? "raw-arousal" : "raw-temperature")
          }
        />
        <Label htmlFor="mode-switch">
          {currentMode === "raw-arousal" ? "Arousal" : "Temperature"}
        </Label>
      </div>
      {currentMode === "raw-temperature" && RawTemperatureUpload}
      {currentMode === "raw-arousal" && <RawArousalUpload />}
    </>
  );
};

export default TemperatureUpload;
