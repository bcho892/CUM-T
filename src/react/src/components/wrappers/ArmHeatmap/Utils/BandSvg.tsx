export interface IBandSVG {
  opacity?: number;
  state?: TemperatureState;
}

export type TemperatureState = "hot" | "cold" | "off";
