import { twMerge } from "tailwind-merge";
import { IBandSVG } from "./BandSvg";

import BicepBandSVG from "@/assets/BicepBand.svg?react";

const BicepBand = ({ opacity, state = "hot" }: IBandSVG) => {
  return (
    <BicepBandSVG
      className={twMerge(
        `${state === "hot" && "fill-red-600"}`,
        `${state === "cold" && "fill-blue-500"}`,
        `stroke-2 stroke-black transition-opacity`,
      )}
      style={{ opacity }}
    />
  );
};

export default BicepBand;
