import { createContext, ReactNode, useEffect, useState } from "react";

type AudioStats = { duration: number; timestamp: number };

/**
 * Interface for the Annotation Context.
 */
interface IAnnotationContext {
  /** The user selected timestamp in the annotation context. */
  selectedTimestamps: number[];
  /** Function to set the current time. */
  setSelectedTimestamps?: (newTime: number[]) => void;
  /** Delta time for the annotation context. */
  deltaT: number;

  audioSrc?: string;
  setAudioSrc?: (newSrc: string) => void;

  audioStats?: AudioStats;
  setAudioStats?: (duration?: number, timestamp?: number) => void;

  /** Function to set the delta time. */
  setDeltaT?: (newDeltaT: number) => void;
  /** Function to update an annotation. */
  updateAnnotation?: (timestamp: number, zone: number) => void;
  /** Function to reset all annotations. */
  resetAnnotations?: () => void;
  /** Function to get an annotation by timestamp. */
  getAnnotation?: (timestamp: number) => number | undefined;
}

/**
 * Annotation Context with default values.
 */
export const AnnotationContext = createContext<IAnnotationContext>({
  selectedTimestamps: [0],
  deltaT: 1,
});

/**
 * Annotation Context Provider component.
 * @param children - The child components to be wrapped by the provider.
 * @returns The Annotation Context Provider component.
 */
export const AnnotationContextProvider = ({
  children,
}: Readonly<{ children: ReactNode }>) => {
  const [selectedTimestamps, setSelectedTimestamps] = useState<number[]>([0]);
  const [deltaT, setDeltaT] = useState<number>(1);
  const [annotations, setAnnotations] = useState<{ [key: number]: number }>({});
  const [audioSrc, setAudioSrc] = useState<string | undefined>();
  const [audioStats, setAudioStats] = useState<AudioStats>({
    duration: 0,
    timestamp: 0,
  });

  /**
   * Updates an annotation with the given timestamp and zone.
   * @param timestamp - The timestamp of the annotation.
   * @param zone - The zone of the annotation.
   */
  const updateAnnotation = (timestamp: number, zone: number) => {
    setAnnotations((prevAnnotations) => ({
      ...prevAnnotations,
      [timestamp]: zone,
    }));
  };

  /**
   * Gets an annotation by the given timestamp.
   * @param timestamp - The timestamp of the annotation.
   * @returns The zone of the annotation or undefined if not found.
   */
  const getAnnotation = (timestamp: number) => annotations[timestamp];

  /**
   * Resets all annotations.
   */
  const resetAnnotations = () => {
    setAnnotations({});
  };

  const _setAudioStats = (duration?: number, timestamp?: number) => {
    duration && setAudioStats({ ...audioStats, duration });
    timestamp && setAudioStats({ ...audioStats, timestamp });
  };

  useEffect(() => {
    // Clear annotations on component unmount
    return () => {
      setAnnotations({});
    };
  }, []);

  return (
    <AnnotationContext.Provider
      value={{
        selectedTimestamps: selectedTimestamps,
        setSelectedTimestamps: setSelectedTimestamps,
        deltaT,
        setDeltaT,
        audioSrc,
        setAudioSrc,
        audioStats,
        setAudioStats: _setAudioStats,
        updateAnnotation,
        resetAnnotations,
        getAnnotation,
      }}
    >
      {children}
    </AnnotationContext.Provider>
  );
};
