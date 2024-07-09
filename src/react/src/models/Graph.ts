import { TemperatureMessage } from "./Message";

export type TemperatureGraphDataPoint = Omit<TemperatureMessage, "prefix"> & {
  time: number;
};
