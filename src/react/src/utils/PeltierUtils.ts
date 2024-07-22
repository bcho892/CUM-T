import { TemperatureGraphDataPoint } from "@/models/Graph";
import { DirectionMessage, TemperatureMessage } from "@/models/Message";

const PeltierUtils = {
  PELTIER_MAX_PERCENT: 100,
  PELTIER_MIN_PERCENT: 0,
  MIN_DUTY_CYCLE: 0,
  MAX_DUTY_CYCLE: Math.pow(2, 16) - 1,
  directionName: (direction: Direction) => {
    switch (direction) {
      case Direction.REVERSE:
        return "Reverse";
      case Direction.FORWARD:
        return "Forward";
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
  isPositiveDirection: (percent: number): Direction => {
    if (percent > 0) return Direction.FORWARD;

    return Direction.REVERSE;
  },
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
