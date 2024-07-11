import { TemperatureMessage } from "./Message";

/**
 * Note that the "negative" numbers mean that it is operating using the "cold" side
 */
export type TemperatureGraphDataPoint = Omit<TemperatureMessage, "prefix"> & {
  time: number;
};

export type ArousalGraphDataPoint = {
  /**
   * The point in time where the point lies. This should be unique and in seconds
   */
  time: number;
  /**
   * The value of the arousal - should be normalised
   */
  value: number;
};
