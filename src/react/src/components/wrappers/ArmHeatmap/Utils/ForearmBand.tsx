import { twMerge } from "tailwind-merge";
import { IBandSVG } from "./BandSvg";

import ForearmBandSVG from "@/assets/ForearmBand.svg?react";

const ForearmBand = ({ opacity = 0.5, state = "hot" }: IBandSVG) => {
  return (
    <ForearmBandSVG
      className={twMerge(
        `${state === "hot" && "fill-red-600"}`,
        `${state === "cold" && "fill-blue-500"}`,
        `stroke-2 stroke-black transition-opacity`,
      )}
      style={{ opacity }}
    />
  );
};

export default ForearmBand;
