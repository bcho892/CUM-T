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
 * Computes if a peltier should be on or not depending on the *zone* the arousal value falls under.
 *
 * Refer to the research report for full documentation on this process
 *
 * @param min the smallest **signed** value in the range of total arousal values
 * @param max the largest **signed** value in the range of total arousal values
 * @param value the **current** arousal value
 * @param priority the number of the peltier to check its active status
 * @returns `true` or `false` depending on where the arousal value falls within the range of values
 */
const isPeltierActive = (
  min: number,
  max: number,
  value: number,
  priority: PeltierOrder,
) => {
  const TOTAL_PELTIERS = 5 as const;
  /**
   * Compute the difference in between different max levels in the zones.
   */
  const step = (max - min) / TOTAL_PELTIERS;

  const polarity: "hot" | "cold" = value > 0 ? "hot" : "cold";

  switch (polarity) {
    case "hot":
      return { active: value > min + step * priority, polarity };
    case "cold":
      return { active: value < max - step * priority, polarity };
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
const peltierDutyCycle = (active: boolean, polarity: "hot" | "cold") => {
  const multiplier = polarity === "hot" ? 1 : -1;
  if (active) {
    return multiplier * PeltierUtils.PELTIER_MAX_PERCENT;
  } else {
    return PeltierUtils.PELTIER_MIN_PERCENT;
  }
};

export const arousalTransformer = (
  arousalPoints: ArousalGraphDataPoint[],
): TemperatureGraphDataPoint[] => {
  const maxPoint = arousalPoints.reduce((prev, curr) =>
    prev.value > curr.value ? prev : curr,
  );

  const minPoint = arousalPoints.reduce((prev, curr) =>
    prev.value < curr.value ? prev : curr,
  );

  const max = maxPoint.value;
  const min = minPoint.value;

  const activitySeries = arousalPoints.map(({ value, time }) => {
    return {
      time,
      peltier1: isPeltierActive(min, max, value, PeltierOrder.FIRST),
      peltier2: isPeltierActive(min, max, value, PeltierOrder.SECOND),
      peltier3: isPeltierActive(min, max, value, PeltierOrder.THIRD),
      peltier4: isPeltierActive(min, max, value, PeltierOrder.FOURTH),
      peltier5: isPeltierActive(min, max, value, PeltierOrder.FIFTH),
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
