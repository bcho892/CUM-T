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

const isPeltierActive = (
  min: number,
  max: number,
  value: number,
  priority: PeltierOrder,
) => {
  const step = (max - min) / 5;

  const polarity: "hot" | "cold" = value > 0 ? "hot" : "cold";

  switch (polarity) {
    case "hot":
      return { active: value > min + step * priority, polarity };
    case "cold":
      return { active: value < max - step * priority, polarity };
  }
};

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
