import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { TemperatureDataContext } from "@/context/TemperatureDataContext";
import { useContext, useEffect, useState } from "react";

type Mode = "raw-temperature" | "raw-arousal";

const TimestepInput = () => {
  const { setDeltaT, deltaT } = useContext(TemperatureDataContext);
  return (
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
  );
};

const RawTemperatureUpload = () => {
  const { setTemperatureValues } = useContext(TemperatureDataContext);

  const [rawTemperatureJson, setRawTemperatureJson] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (rawTemperatureJson) {
      setTemperatureValues?.(JSON.parse(rawTemperatureJson));
    }
  }, [rawTemperatureJson, setTemperatureValues]);

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

        <TimestepInput />
      </span>

      <Textarea
        placeholder="No temperature profile JSON"
        value={rawTemperatureJson}
        disabled
      />
    </>
  );
};

/**
 * component for handling uploading raw arousal values
 */
const RawArousalUpload = () => {
  const { setArousalValueDataPoints } = useContext(TemperatureDataContext);

  const [rawArousalValues, setRawArousalValues] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (rawArousalValues) {
      setArousalValueDataPoints?.(JSON.parse(rawArousalValues));
    }
  }, [rawArousalValues, setArousalValueDataPoints]);

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

        <TimestepInput />
      </span>

      <Textarea
        placeholder="No raw arousal JSON"
        value={rawArousalValues}
        disabled
      />
    </>
  );
};

interface ITemperatureUpload {
  showControls?: boolean;
}

const TemperatureUpload = ({ showControls = false }: ITemperatureUpload) => {
  const [currentMode, setCurrentMode] = useState<Mode>("raw-arousal");

  const { temperatureValues, isPlaying, setIsPlaying } = useContext(
    TemperatureDataContext,
  );

  return (
    <>
      <div className="flex items-center space-x-2 my-2">
        <Switch
          id="mode-switch"
          defaultChecked={currentMode === "raw-arousal"}
          onCheckedChange={(checked) =>
            setCurrentMode(checked ? "raw-arousal" : "raw-temperature")
          }
        />
        <Label htmlFor="mode-switch">
          {currentMode === "raw-arousal" ? "Arousal" : "Temperature"}
        </Label>
      </div>
      {currentMode === "raw-temperature" && <RawTemperatureUpload />}
      {currentMode === "raw-arousal" && <RawArousalUpload />}

      {showControls && (
        <span className="gap-2 flex mt-3">
          <Button
            disabled={!temperatureValues || isPlaying}
            onClick={() => {
              setIsPlaying?.(true);
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
      )}
    </>
  );
};

export default TemperatureUpload;
