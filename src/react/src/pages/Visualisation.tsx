import ArmHeatmap from "@/components/wrappers/ArmHeatmap/ArmHeatmap";
import TemperatureGraph from "@/components/wrappers/TemperatureGraph/TemperatureGraph";
import TemperatureUpload from "@/components/wrappers/TemperatureUpload/TemperatureUpload";
import { TemperatureDataContext } from "@/context/TemperatureDataContext";
import { useTemperaturePlayer } from "@/hooks/useTemperaturePlayer";
import { to2Dp } from "@/lib/utils";
import { useContext } from "react";

const Visualisation = () => {
  const { temperatureValues, currentTemperatureIndex, deltaT } = useContext(
    TemperatureDataContext,
  );

  useTemperaturePlayer();

  // Calculate the value on the x axis the guide line should be at
  const currentTime = to2Dp(currentTemperatureIndex * deltaT);

  return (
    <div className="w-full flex flex-col gap-4">
      <h1>Temperature Visualisation</h1>
      {temperatureValues.length > 0 ? (
        <TemperatureGraph
          data={temperatureValues}
          currentTimestamp={currentTime}
        />
      ) : (
        <div>
          <h2>Load a temperature profile</h2>
          <p>Either generate a profile or make your own</p>
        </div>
      )}
      <h2>Haptic sleeve temperature zones</h2>
      <ArmHeatmap
        currentTemperatureValues={temperatureValues[currentTemperatureIndex]}
      />
      <TemperatureUpload showControls />
    </div>
  );
};

export default Visualisation;
