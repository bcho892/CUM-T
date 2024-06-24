interface Message {
  prefix: string;
}

export enum Direction {
  REVERSE = 2,
  FORWARD = 3,
}

export interface TemperatureMessage extends Message {
  /**
   * Format: Peltiers 1, Peltiers 2, Peltiers 3, Peltiers 4, Peltiers 5 etc
   */
  peltier1Value: number;
  peltier2Value: number;
}

export interface DirectionMessage extends Message {
  peltier1Direction: Direction;
  peltier2Direction: Direction;
}
