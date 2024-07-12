export interface IBandSVG {
  opacity?: number;
  state?: TemperatureState;
  labelPosition?: "left" | "right";
}

export type TemperatureState = "hot" | "cold" | "off";
