import { ReactNode } from "react";

export interface IBandSVG {
  opacity?: number;
  state?: TemperatureState;
  labelPosition?: "left" | "right";
  children?: ReactNode;
}

export type TemperatureState = "hot" | "cold" | "off";
