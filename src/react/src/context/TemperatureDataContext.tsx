import {
  ArousalGraphDataPoint,
  TemperatureGraphDataPoint,
} from "@/models/Graph";
import { arousalTransformer } from "@/utils/Transformers";
import { createContext, ReactNode, useEffect, useState } from "react";

const DEFAULT_DELTA_T = 0.05 as const;

interface ITemperatureDataContext {
  /**
   * The list of temperature values to parse and actuate
   */
  temperatureValues: TemperatureGraphDataPoint[];

  /**
   * Setter method for `temperatureValues`
   */
  setTemperatureValues?: (newValues: TemperatureGraphDataPoint[]) => void;

  /**
   * The difference in time between two consecutive values in `temperatureValues`
   *
   * Unit should be seconds.
   */
  deltaT: number;

  /**
   * Setter method for `deltaT`
   */
  setDeltaT?: (newDeltaT: number) => void;

  /**
   * The currently processing value of the `temperatureValues` list
   */
  currentTemperatureIndex: number;

  /**
   * Setter method for `currentTemperatureIndex`
   */
  setCurrentTemperatureIndex?: (newIndex: number) => void;

  /**
   * If the index of the `temperatureValues` list should be automatically increasing
   */
  isPlaying: boolean;

  /**
   * Setter method for `isPlaying`
   */
  setIsPlaying?: (newState: boolean) => void;

  arousalValueDataPoints?: ArousalGraphDataPoint[];
  setArousalValueDataPoints?: (dataPoints: ArousalGraphDataPoint[]) => void;
}

export const TemperatureDataContext = createContext<ITemperatureDataContext>({
  temperatureValues: [],
  currentTemperatureIndex: 0,
  isPlaying: false,
  deltaT: DEFAULT_DELTA_T,
});

export const TempeartureDataContextProvider = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const [temperatureValues, setTemperatureValues] = useState<
    TemperatureGraphDataPoint[]
  >([]);

  const [arousalGraphDataPoints, setArousalGraphDataPoints] = useState<
    ArousalGraphDataPoint[] | undefined
  >();

  useEffect(() => {
    if (arousalGraphDataPoints) {
      setTemperatureValues(arousalTransformer(arousalGraphDataPoints));
    }
  }, [arousalGraphDataPoints]);

  const [deltaT, setDeltaT] = useState<number>(DEFAULT_DELTA_T);

  const [currentTemperatureIndex, setCurrentTemperatureIndex] =
    useState<number>(0);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  return (
    <TemperatureDataContext.Provider
      value={{
        temperatureValues,
        setTemperatureValues,

        deltaT,
        setDeltaT,

        currentTemperatureIndex,
        setCurrentTemperatureIndex,

        isPlaying,
        setIsPlaying,

        arousalValueDataPoints: arousalGraphDataPoints,
        setArousalValueDataPoints: setArousalGraphDataPoints,
      }}
    >
      {children}
    </TemperatureDataContext.Provider>
  );
};
