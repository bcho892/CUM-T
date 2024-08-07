import { TemperatureGraphDataPoint } from "@/models/Graph";
import { DirectionMessage, TemperatureMessage } from "@/models/Message";

const PeltierUtils = {
  PELTIER_MAX_PERCENT: 100,
  PELTIER_MIN_PERCENT: 0,
  MIN_DUTY_CYCLE: 0,
  /**
   * 2^16 - 1: 16 bit PWM
   */
  MAX_DUTY_CYCLE: Math.pow(2, 16) - 1,
  directionName: (direction: Direction) => {
    switch (direction) {
      case Direction.REVERSE:
        return "Cold";
      case Direction.FORWARD:
        return "Hot";
    }
  },
  /**
   * @param percent the percentage of the max duty cycle
   * @param scale This is **NOT** used for computing a duty cycle for the peltiers,
   * rather to reduce the max temperature in case of the max being too hot
   * @returns the PWM duty cycle value (16 bits)
   */
  percentOfCurrentMaxDutyCycle: (percent: number, scale: number) => {
    return Math.trunc(
      (Math.abs(percent) / 100) * (PeltierUtils.MAX_DUTY_CYCLE * (scale / 100)),
    );
  },
  /**
   *
   * @param percent the *signed* percentage of the temperature intensity
   * @returns the appropriate direction for the peltier
   */
  isPositiveDirection: (percent: number): Direction => {
    if (percent > 0) return Direction.FORWARD;

    return Direction.REVERSE;
  },
  /**
   * Converts from a percentage to the 16 bit duty cycle value, in order to format
   * it in an appropriate form to send via websockets
   *
   * @param original an object representing the temperature percentage from `-100 to 100` as its `value` field
   * @param scale How much of the max duty sycle to use -> this is important if the max temperature is not tolerable by a user
   * @returns an object containing `dutyCycles` (the formatted messages used for determining what duty cycles to send via ws)
   * and also `directions` (the formatted messages to allow for configuring what operation mode the peltiers will be in)
   */
  percentageToDuty: (
    original?: TemperatureGraphDataPoint,
    scale: number = 100,
  ): { dutyCycles: TemperatureMessage; directions: DirectionMessage } => {
    if (!original) {
      return {
        dutyCycles: DEFAULT_DUTY_CYCLES,
        directions: DEFAULT_DIRECTIONS,
      };
    }

    const {
      peltier1Value,
      peltier2Value,
      peltier3Value,
      peltier4Value,
      peltier5Value,
    } = original;

    return {
      dutyCycles: {
        peltier1Value: PeltierUtils.percentOfCurrentMaxDutyCycle(
          peltier1Value,
          scale,
        ),
        peltier2Value: PeltierUtils.percentOfCurrentMaxDutyCycle(
          peltier2Value,
          scale,
        ),
        peltier3Value: PeltierUtils.percentOfCurrentMaxDutyCycle(
          peltier3Value,
          scale,
        ),
        peltier4Value: PeltierUtils.percentOfCurrentMaxDutyCycle(
          peltier4Value,
          scale,
        ),
        peltier5Value: PeltierUtils.percentOfCurrentMaxDutyCycle(
          peltier5Value,
          scale,
        ),
      },
      directions: {
        peltier1Direction: PeltierUtils.isPositiveDirection(peltier1Value),
        peltier2Direction: PeltierUtils.isPositiveDirection(peltier2Value),
        peltier3Direction: PeltierUtils.isPositiveDirection(peltier3Value),
        peltier4Direction: PeltierUtils.isPositiveDirection(peltier4Value),
        peltier5Direction: PeltierUtils.isPositiveDirection(peltier5Value),
      },
    };
  },
} as const;

/**
 * Note that each of the values **must** correspond to either `2` or `3` as
 * that is how they are parsed on the Pico Pi W
 */
export enum Direction {
  REVERSE = 2,
  FORWARD = 3,
}

export const DEFAULT_DUTY_CYCLES = {
  peltier1Value: PeltierUtils.MIN_DUTY_CYCLE,
  peltier2Value: PeltierUtils.MIN_DUTY_CYCLE,
  peltier3Value: PeltierUtils.MIN_DUTY_CYCLE,
  peltier4Value: PeltierUtils.MIN_DUTY_CYCLE,
  peltier5Value: PeltierUtils.MIN_DUTY_CYCLE,
};

export const DEFAULT_DIRECTIONS = {
  peltier1Direction: Direction.REVERSE,
  peltier2Direction: Direction.REVERSE,
  peltier3Direction: Direction.REVERSE,
  peltier4Direction: Direction.REVERSE,
  peltier5Direction: Direction.REVERSE,
};

export default PeltierUtils;
