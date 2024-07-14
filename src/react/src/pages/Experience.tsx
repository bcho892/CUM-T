import ArmHeatmap from "@/components/wrappers/ArmHeatmap/ArmHeatmap";
import MusicPlayer from "@/components/wrappers/MusicPlayer/MusicPlayer";
import TemperatureUpload from "@/components/wrappers/TemperatureUpload/TemperatureUpload";
import { TemperatureDataContext } from "@/context/TemperatureDataContext";
import { useTemperaturePlayer } from "@/hooks/useTemperaturePlayer";
import { useContext, useState } from "react";
import { twMerge } from "tailwind-merge";

type FlowState = "pick-music" | "get-temperature-profile";

const Experience = () => {
  const {
    isPlaying,
    setIsPlaying,
    temperatureValues,
    currentTemperatureIndex,
  } = useContext(TemperatureDataContext);

  useTemperaturePlayer();

  const [currentState, setCurrentState] = useState<FlowState>("pick-music");

  return (
    <div className="flex flex-col gap-4">
      <h1>Experience Haptics and Music!</h1>
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
      />
      <span
        className={twMerge(
          currentState === "pick-music" && "blur-sm pointer-events-none",
        )}
      >
        <TemperatureUpload />
      </span>
      <ArmHeatmap
        currentTemperatureValues={temperatureValues[currentTemperatureIndex]}
      />
    </div>
  );
};

export default Experience;
