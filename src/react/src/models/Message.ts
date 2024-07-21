import { Direction } from "@/utils/PeltierUtils";

interface Message {
  /**
   * @deprecated not used, probably will be removed
   */
  prefix?: string;
}

export interface TemperatureMessage extends Message {
  /**
   * Format: Peltiers 1, Peltiers 2, Peltiers 3, Peltiers 4, Peltiers 5 etc
   */
  peltier1Value: number;
  peltier2Value: number;
  peltier3Value: number;
  peltier4Value: number;
  peltier5Value: number;
}

export interface DirectionMessage extends Message {
  peltier1Direction: Direction;
  peltier2Direction: Direction;
  peltier3Direction: Direction;
  peltier4Direction: Direction;
  peltier5Direction: Direction;
}

/**
 * Format: Temperature Configs (derived from `TemperatureMessage` type)\n Direction Configs
 */
export type ConfigMessage = `${string}\n${string}`;
