import HapticArm from "@/assets/HapticArm.svg?react";
import Band from "./Utils/Band";
import BicepBand from "./Utils/BicepBand";
import ForearmBand from "./Utils/ForearmBand";

const ArmHeatmap = () => {
  return (
    <div className="w-full relative">
      <div className="w-full h-auto max-w-[500px] relative">
        <Band top={45} left={270} width={120}>
          <BicepBand />
        </Band>

        <Band top={10} left={360} width={130}>
          <BicepBand opacity={0.5} />
        </Band>

        <Band top={220} left={100}>
          <ForearmBand state="cold" />
        </Band>

        <Band top={170} left={120}>
          <ForearmBand />
        </Band>

        <Band top={120} left={150}>
          <ForearmBand />
        </Band>
        <HapticArm />
      </div>
    </div>
  );
};

export default ArmHeatmap;
