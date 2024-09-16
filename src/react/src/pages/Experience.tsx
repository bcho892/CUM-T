import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import ArmHeatmap from "@/components/wrappers/ArmHeatmap/ArmHeatmap";
import ArousalGraph from "@/components/wrappers/ArousalGraph/ArousalGraph";
import MusicPlayer from "@/components/wrappers/MusicPlayer/MusicPlayer";
import PureAudioPlayer from "@/components/wrappers/PureAudioPlayer/PureAudioPlayer";
import TemperatureUpload from "@/components/wrappers/TemperatureUpload/TemperatureUpload";
import { TemperatureDataContext } from "@/context/TemperatureDataContext";
import { useConfigMessageCallback } from "@/hooks/useConfigMessageCallback";
import PeltierUtils from "@/utils/PeltierUtils";
import { useContext, useEffect, useMemo, useState } from "react";
import { ReadyState } from "react-use-websocket";
import { twMerge } from "tailwind-merge";

type FlowState = "pick-music" | "get-temperature-profile";

const Experience = () => {
  /**
   * What stage of the page the user is on
   */
  const [currentState, setCurrentState] = useState<FlowState>("pick-music");
  /**
   * Used to control what 100% should be like on the sleeve:w
   */
  const [maxScale, setMaxScale] = useState<number>(100);

  const {
    readyState,
    handleSendConfigMessage,
    setters: { setCurrentTemperatureMessage, setCurrentDirectionMessage },
    currentConfigs: { currentTemperatureMessage, currentDirectionMessage },
  } = useConfigMessageCallback();

  const { deltaT } = useContext(TemperatureDataContext);

  const {
    isPlaying,
    setIsPlaying,
    temperatureValues,
    currentTemperatureIndex,
    setCurrentTemperatureIndex,
    arousalValueDataPoints,
    setArousalValueDataPoints,
  } = useContext(TemperatureDataContext);

  const [audioSrc, setAudioSrc] = useState<string | undefined>();

  /**
   * The unprocessed temperatures as _percentages_ for the current configuration
   */
  const currentTemperatures = useMemo(
    () => temperatureValues[currentTemperatureIndex],
    [temperatureValues, currentTemperatureIndex],
  );

  /**
   * The duty cycle for the current configuration - not directly sent over sockets
   */
  const dutyCycleValues = useMemo(
    () => PeltierUtils.percentageToDuty(currentTemperatures, maxScale),
    [currentTemperatures, maxScale],
  );

  const peltierDutyCycleString = useMemo(
    () => `Current duty cycle(s):\n
        1: ${currentTemperatureMessage.peltier1Value}
        2: ${currentTemperatureMessage.peltier2Value}
        3: ${currentTemperatureMessage.peltier3Value}
        4: ${currentTemperatureMessage.peltier4Value}
        5: ${currentTemperatureMessage.peltier5Value}
  `,
    [currentTemperatureMessage],
  );

  const peltierDirectionString = useMemo(
    () => `
        Current direction(s):\n
        1: ${PeltierUtils.directionName(currentDirectionMessage.peltier1Direction)}
        2: ${PeltierUtils.directionName(currentDirectionMessage.peltier2Direction)}
        3: ${PeltierUtils.directionName(currentDirectionMessage.peltier3Direction)}
        4: ${PeltierUtils.directionName(currentDirectionMessage.peltier4Direction)}
        5: ${PeltierUtils.directionName(currentDirectionMessage.peltier5Direction)}
  `,
    [currentDirectionMessage],
  );

  useEffect(() => {
    setCurrentTemperatureMessage(dutyCycleValues.dutyCycles);
    setCurrentDirectionMessage(dutyCycleValues.directions);
    if (readyState === ReadyState.OPEN) {
      handleSendConfigMessage();
    }
  }, [
    dutyCycleValues,
    currentTemperatures,
    setCurrentDirectionMessage,
    setCurrentTemperatureMessage,
    maxScale,
    readyState,
    handleSendConfigMessage,
  ]);

  const handleReset = () => {
    /**
     * Pause the music
     */
    setIsPlaying?.(false);

    /**
     * Clear the current graph
     */
    setArousalValueDataPoints?.([]);

    /**
     * Force user to choose another audio file if they reset
     */
    setCurrentState("pick-music");

    /**
     * If the profile is reset should make sure the sleeve is also off
     */
    setCurrentTemperatureMessage({
      peltier1Value: 0,
      peltier2Value: 0,
      peltier3Value: 0,
      peltier4Value: 0,
      peltier5Value: 0,
    });
  };

  const currentTimestamp = deltaT * currentTemperatureIndex;

  return (
    <div className="flex flex-col gap-3">
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

      <h2>Step 1 - Upload Music File</h2>

      <MusicPlayer
        onFileChange={(newSrc) => setAudioSrc?.(newSrc)}
        isPlaying={isPlaying}
        onFileValidityChange={(valid) => {
          if (valid) {
            setCurrentState("get-temperature-profile");
          }
        }}
      />

      <span
        className={twMerge(
          currentState === "pick-music" && "blur-sm pointer-events-none",
        )}
      >
        <h2>Step 2 - Upload Temperature Profile</h2>
        <TemperatureUpload />
      </span>

      <PureAudioPlayer
        src={audioSrc || ""}
        onTimeUpdate={(newTime) => {
          setCurrentTemperatureIndex?.(Math.floor(newTime));
        }}
      />
      {arousalValueDataPoints && (
        <ArousalGraph
          data={arousalValueDataPoints}
          currentTimestamp={currentTimestamp}
        />
      )}

      <Button
        variant="destructive"
        onClick={handleReset}
        disabled={currentState === "pick-music"}
      >
        Reset
      </Button>
      <h5>
        <strong>{peltierDutyCycleString}</strong>
        <br />
        <strong>{peltierDirectionString}</strong>
      </h5>

      <ArmHeatmap currentTemperatureValues={currentTemperatures} />
    </div>
  );
};

export default Experience;
