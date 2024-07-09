const PeltierUtils = {
  PELTIER_MAX_VALUE: 65565,
  PELTIER_MIN_VALUE: 0,
} as const;

export enum Direction {
  REVERSE = 2,
  FORWARD = 3,
}

export default PeltierUtils;
