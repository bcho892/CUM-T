import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import ArmHeatmap from "@/components/wrappers/ArmHeatmap/ArmHeatmap";
import ArousalGraph from "@/components/wrappers/ArousalGraph/ArousalGraph";
import MusicPlayer from "@/components/wrappers/MusicPlayer/MusicPlayer";
import TemperatureUpload from "@/components/wrappers/TemperatureUpload/TemperatureUpload";
import { TemperatureDataContext } from "@/context/TemperatureDataContext";
import { useConfigMessageCallback } from "@/hooks/useConfigMessageCallback";
import { useTemperaturePlayer } from "@/hooks/useTemperaturePlayer";
import PeltierUtils from "@/utils/PeltierUtils";
import { useContext, useEffect, useMemo, useState } from "react";
import { ReadyState } from "react-use-websocket";
import { twMerge } from "tailwind-merge";

type FlowState = "pick-music" | "get-temperature-profile";

const Experience = () => {
  const [currentState, setCurrentState] = useState<FlowState>("pick-music");
  const [maxScale, setMaxScale] = useState<number>(100);

  const {
    readyState,
    handleSendConfigMessage,
    setters: { setCurrentTemperatureMessage, setCurrentDirectionMessage },
    currentConfigs: { currentTemperatureMessage, currentDirectionMessage },
  } = useConfigMessageCallback();

  const {
    isPlaying,
    setIsPlaying,
    temperatureValues,
    currentTemperatureIndex,
    arousalValueDataPoints,
  } = useContext(TemperatureDataContext);

  const currentTemperatures = useMemo(
    () => temperatureValues[currentTemperatureIndex],
    [temperatureValues, currentTemperatureIndex],
  );

  const messages = useMemo(
    () => PeltierUtils.percentageToDuty(currentTemperatures, maxScale),
    [currentTemperatures, maxScale],
  );

  useEffect(() => {
    setCurrentTemperatureMessage(messages.dutyCycles);
    setCurrentDirectionMessage(messages.directions);
    if (readyState === ReadyState.OPEN) {
      handleSendConfigMessage();
    }
  }, [
    messages,
    currentTemperatures,
    setCurrentDirectionMessage,
    setCurrentTemperatureMessage,
    maxScale,
    readyState,
    handleSendConfigMessage,
  ]);

  useTemperaturePlayer((val) => {
    if (val) console.log("tick!");
    else console.log("stopped");
  });

  return (
    <div className="flex flex-col gap-4">
      <h1>Experience Haptics and Music!</h1>

      <Label htmlFor="max-duty">
        Set percentage of max temperature. Current: {maxScale}
      </Label>
      <Slider
        min={PeltierUtils.PELTIER_MIN_PERCENT}
        max={PeltierUtils.PELTIER_MAX_PERCENT}
        value={[maxScale]}
        onValueChange={(value) => setMaxScale(value[0])}
        id="max-duty"
      />
      <MusicPlayer
        isPlaying={isPlaying}
        play={() => {
          setIsPlaying?.(true);
        }}
        pause={() => {
          setIsPlaying?.(false);
        }}
        onFileValidityChange={(valid) => {
          if (valid) {
            setCurrentState("get-temperature-profile");
          }
        }}
        showPlayButton={readyState === ReadyState.OPEN}
      />
      <span
        className={twMerge(
          currentState === "pick-music" && "blur-sm pointer-events-none",
        )}
      >
        <TemperatureUpload />
      </span>
      {arousalValueDataPoints && <ArousalGraph data={arousalValueDataPoints} />}
      <h5>
        Current duty cycle: {currentTemperatureMessage.peltier1Value}, Current
        direction:{" "}
        {PeltierUtils.directionName(currentDirectionMessage.peltier1Direction)}
      </h5>
      <ArmHeatmap currentTemperatureValues={currentTemperatures} />
    </div>
  );
};

export default Experience;
