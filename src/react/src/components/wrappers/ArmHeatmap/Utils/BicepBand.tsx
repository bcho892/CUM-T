import { twMerge } from "tailwind-merge";
import { IBandSVG } from "./BandSvg";

import BicepBandSVG from "@/assets/BicepBand.svg?react";
import BandLabel from "./BandLabel";

const BicepBand = ({
  opacity = 0,
  labelPosition = "right",
  state = "hot",
  children,
}: IBandSVG) => {
  return (
    <>
      <BicepBandSVG
        className={twMerge(
          `${state === "hot" && "fill-red-600"}`,
          `${state === "cold" && "fill-blue-500"}`,
          `stroke-2 stroke-black transition-opacity overflow-visible`,
        )}
        style={{ opacity }}
      />
      <BandLabel show={opacity > 0} labelPosition={labelPosition}>
        {children}
      </BandLabel>
    </>
  );
};

export default BicepBand;
