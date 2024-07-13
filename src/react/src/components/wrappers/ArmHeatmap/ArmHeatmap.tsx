import HapticArm from "@/assets/HapticArm.svg?react";
import Band from "./Utils/Band";
import BicepBand from "./Utils/BicepBand";
import ForearmBand from "./Utils/ForearmBand";
import { TemperatureGraphDataPoint } from "@/models/Graph";
import { useMemo } from "react";
import PeltierUtils from "@/utils/PeltierUtils";
import { TemperatureState } from "./Utils/BandSvg";
import { twMerge } from "tailwind-merge";
import { to2Dp } from "@/lib/utils";

interface IArmHeatmap {
  currentTemperatureValues?: Omit<TemperatureGraphDataPoint, "time">;
}

const temperatureToPercentage = (temperature: number) => {
  return to2Dp(Math.abs(temperature) / PeltierUtils.PELTIER_MAX_VALUE) * 100;
};

const temperatureToOpacity = (temperature: number) => {
  return (temperatureToPercentage(temperature) / 100) * 0.5;
};

const temperatureToState = (temperature: number): TemperatureState => {
  return temperature < 0 ? "cold" : "hot";
};

const TemperatureIndicator = ({
  state,
  percentage,
}: {
  state: TemperatureState;
  percentage: number;
}) => {
  return (
    <>
      <div
        className={twMerge(
          "w-2 rounded-sm transition-all self-end",
          state === "hot" && "bg-red-500",
          state === "cold" && "bg-blue-500",
        )}
        style={{ height: `${percentage}%` }}
      />
      <strong>{percentage}%</strong>
    </>
  );
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

  const percentages = useMemo(() => {
    return {
      zone1: temperatureToPercentage(
        currentTemperatureValues?.peltier1Value || 0,
      ),
      zone2: temperatureToPercentage(
        currentTemperatureValues?.peltier2Value || 0,
      ),
      zone3: temperatureToPercentage(
        currentTemperatureValues?.peltier3Value || 0,
      ),
      zone4: temperatureToPercentage(
        currentTemperatureValues?.peltier4Value || 0,
      ),
      zone5: temperatureToPercentage(
        currentTemperatureValues?.peltier5Value || 0,
      ),
    };
  }, [currentTemperatureValues]);

  return (
    <div className="w-full min-w-[500px] relative flex justify-center">
      <div className="w-[500px] h-auto relative">
        <Band top={45} left={270} width={120}>
          <BicepBand
            opacity={opacities.zone4}
            state={states.zone4}
            labelPosition="right"
          >
            <TemperatureIndicator
              state={states.zone4}
              percentage={percentages.zone4}
            />
          </BicepBand>
        </Band>

        <Band top={10} left={360} width={130}>
          <BicepBand
            opacity={opacities.zone5}
            state={states.zone5}
            labelPosition="right"
          >
            <TemperatureIndicator
              state={states.zone5}
              percentage={percentages.zone5}
            />
          </BicepBand>
        </Band>

        {/** Set 1 */}
        <Band top={230} left={90}>
          <ForearmBand opacity={opacities.zone1} state={states.zone1}>
            <TemperatureIndicator
              state={states.zone1}
              percentage={percentages.zone1}
            />
          </ForearmBand>
        </Band>

        {/** Set 2 */}
        <Band top={175} left={110} width={160}>
          <ForearmBand opacity={opacities.zone2} state={states.zone2}>
            <TemperatureIndicator
              state={states.zone2}
              percentage={percentages.zone2}
            />
          </ForearmBand>
        </Band>

        {/**Set 3 */}
        <Band top={120} left={140} width={170}>
          <ForearmBand opacity={opacities.zone3} state={states.zone3}>
            <TemperatureIndicator
              state={states.zone3}
              percentage={percentages.zone3}
            />
          </ForearmBand>
        </Band>
        <HapticArm />
      </div>
    </div>
  );
};

export default ArmHeatmap;
