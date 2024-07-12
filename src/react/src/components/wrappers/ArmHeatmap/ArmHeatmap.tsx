import HapticArm from "@/assets/HapticArm.svg?react";
import Band from "./Utils/Band";
import BicepBand from "./Utils/BicepBand";
import ForearmBand from "./Utils/ForearmBand";
import { TemperatureGraphDataPoint } from "@/models/Graph";
import { useMemo } from "react";
import PeltierUtils from "@/utils/PeltierUtils";
import { TemperatureState } from "./Utils/BandSvg";

interface IArmHeatmap {
  currentTemperatureValues?: Omit<TemperatureGraphDataPoint, "time">;
}

const temperatureToOpacity = (temperature: number) => {
  const percentMax = Math.abs(temperature) / PeltierUtils.PELTIER_MAX_VALUE;
  return percentMax * 0.5;
};

const temperatureToState = (temperature: number): TemperatureState => {
  return temperature < 0 ? "cold" : "hot";
};

const ArmHeatmap = ({ currentTemperatureValues }: Readonly<IArmHeatmap>) => {
  const opacities = useMemo(() => {
    return {
      zone1: temperatureToOpacity(currentTemperatureValues?.peltier1Value || 0),
      zone2: temperatureToOpacity(currentTemperatureValues?.peltier2Value || 0),
      zone3: temperatureToOpacity(currentTemperatureValues?.peltier3Value || 0),
      zone4: temperatureToOpacity(currentTemperatureValues?.peltier4Value || 0),
      zone5: temperatureToOpacity(currentTemperatureValues?.peltier5Value || 0),
    };
  }, [currentTemperatureValues]);

  const states = useMemo(() => {
    return {
      zone1: temperatureToState(currentTemperatureValues?.peltier1Value || 0),
      zone2: temperatureToState(currentTemperatureValues?.peltier2Value || 0),
      zone3: temperatureToState(currentTemperatureValues?.peltier3Value || 0),
      zone4: temperatureToState(currentTemperatureValues?.peltier4Value || 0),
      zone5: temperatureToState(currentTemperatureValues?.peltier5Value || 0),
    };
  }, [currentTemperatureValues]);

  return (
    <div className="w-full relative">
      <div className="w-full h-auto max-w-[500px] relative">
        <Band top={45} left={270} width={120}>
          <BicepBand opacity={opacities.zone4} state={states.zone4} />
        </Band>

        <Band top={10} left={360} width={130}>
          <BicepBand opacity={opacities.zone5} state={states.zone5} />
        </Band>

        {/** Set 1 */}
        <Band top={230} left={90}>
          <ForearmBand opacity={opacities.zone1} state={states.zone1} />
        </Band>

        {/** Set 2 */}
        <Band top={175} left={110} width={160}>
          <ForearmBand opacity={opacities.zone2} state={states.zone2} />
        </Band>

        {/**Set 3 */}
        <Band top={120} left={140} width={170}>
          <ForearmBand opacity={opacities.zone3} state={states.zone3} />
        </Band>
        <HapticArm />
      </div>
    </div>
  );
};

export default ArmHeatmap;
