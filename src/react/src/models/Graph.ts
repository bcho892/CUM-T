import { TemperatureMessage } from "./Message";

/**
 * Note that the "negative" numbers mean that it is operating using the "cold" side
 */
export type TemperatureGraphDataPoint = Omit<TemperatureMessage, "prefix"> & {
  time: number;
};
