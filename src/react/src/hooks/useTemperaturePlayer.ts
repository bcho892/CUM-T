import { TemperatureDataContext } from "@/context/TemperatureDataContext";
import { useContext, useEffect } from "react";

const MS_IN_SECOND = 1000 as const;

export const useTemperaturePlayer = (
  callback?: (isPlaying: boolean) => void,
) => {
  const {
    temperatureValues,
    currentTemperatureIndex,
    setCurrentTemperatureIndex,
    isPlaying,
    setIsPlaying,
    deltaT,
  } = useContext(TemperatureDataContext);
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        if (currentTemperatureIndex < temperatureValues.length - 1) {
          setCurrentTemperatureIndex?.(currentTemperatureIndex + 1);
          // Mostly to update the temperature values on peltiers
          callback?.(true);
        } else {
          setCurrentTemperatureIndex?.(0);
          setIsPlaying?.(false);
          callback?.(false);
        }
      }, deltaT * MS_IN_SECOND);
    }
    return () => clearInterval(interval);
  }, [
    currentTemperatureIndex,
    isPlaying,
    deltaT,
    temperatureValues,
    setCurrentTemperatureIndex,
    setIsPlaying,
    callback,
  ]);
};
