import {
  ArousalGraphDataPoint,
  TemperatureGraphDataPoint,
} from "@/models/Graph";
import PeltierUtils from "./PeltierUtils";

enum PeltierOrder {
  FIRST = 1,
  SECOND = 2,
  THIRD = 3,
  FOURTH = 4,
  FIFTH = 5,
}

/**
 * The max _and_ min bounds for the arousal values. This must be consistent with all other annotaions
 */
const AROUSAL_LIMITS = 1 as const;

/**
 * The value that any fluctuations in arousal should deviate from
 */
const BASELINE_AROUSAL = 0 as const;

/**
 * Each "peltier" refers to a zone on the sleeve
 */
export const TOTAL_PELTIERS = 5 as const;

/**
 * Utility type to determine what "side" should be active for the peltier
 */
export type PeltierStates = "hot" | "cold";

/**
 * Computes if a peltier should be on or not depending on the *zone* the arousal value falls under.
 *
 * Refer to the research report for full documentation on this process
 *
 * @param value the **current** arousal value
 * @param priority the number of the peltier to check its active status
 * @returns `true` or `false` depending on where the arousal value falls within the range of values
 */
const isPeltierActive = (value: number, priority: PeltierOrder) => {
  /**
   * Compute the "size" of each zone.
   *
   * Need to add `1` to the total peltiers because there is an "extra" one
   * right before the max
   */
  const step = AROUSAL_LIMITS / (TOTAL_PELTIERS + 1);

  const polarity: PeltierStates = value > 0 ? "hot" : "cold";

  switch (polarity) {
    case "hot":
      return { active: value > BASELINE_AROUSAL + step * priority, polarity };
    case "cold":
      return { active: value < BASELINE_AROUSAL - step * priority, polarity };
  }
};

/**
 * Gives the percentage *max temperature* that the peltier should operate at,
 * with the sign of the percentage indicating a polarity
 *
 * @param active `true` if the peltier should be turned on, `false` if otherwise
 * @param polarity `"hot"` or `"cold"`
 * @returns a percentage ranging from `-100` to `100`
 */
const peltierDutyCycle = (active: boolean, polarity: PeltierStates) => {
  const multiplier = polarity === "hot" ? 1 : -1;
  if (active) {
    return multiplier * PeltierUtils.PELTIER_MAX_PERCENT;
  } else {
    return PeltierUtils.PELTIER_MIN_PERCENT;
  }
};

/**
 * Converts a time series of arousal values to the corresponding time series
 * of temperature percentagaes.
 *
 * @param arousalPoints The list of arsousal values in the format specified by {@link ArousalGraphDataPoint},
 * which will _not_ be mutated
 * @returns The corresponsding temperature percentages in the format {@link TemperatureGraphDataPoint}
 */
export const arousalTransformer = (
  arousalPoints: ArousalGraphDataPoint[],
): TemperatureGraphDataPoint[] => {
  const activitySeries = arousalPoints.map(({ value, time }) => {
    return {
      time,
      peltier1: isPeltierActive(value, PeltierOrder.FIRST),
      peltier2: isPeltierActive(value, PeltierOrder.SECOND),
      peltier3: isPeltierActive(value, PeltierOrder.THIRD),
      peltier4: isPeltierActive(value, PeltierOrder.FOURTH),
      peltier5: isPeltierActive(value, PeltierOrder.FIFTH),
    };
  });

  const transformedValues: TemperatureGraphDataPoint[] = activitySeries.map(
    (timestamp) => {
      const { peltier1, peltier2, peltier3, peltier4, peltier5 } = timestamp;
      return {
        time: timestamp.time,
        peltier1Value: peltierDutyCycle(peltier1.active, peltier1.polarity),
        peltier2Value: peltierDutyCycle(peltier2.active, peltier2.polarity),
        peltier3Value: peltierDutyCycle(peltier3.active, peltier3.polarity),
        peltier4Value: peltierDutyCycle(peltier4.active, peltier4.polarity),
        peltier5Value: peltierDutyCycle(peltier5.active, peltier5.polarity),
      };
    },
  );

  return transformedValues;
};
