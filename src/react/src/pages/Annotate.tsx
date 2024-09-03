import { Button } from "@/components/ui/button";
import AnnotationLevelBar from "@/components/wrappers/Annotation/AnnotationBar/AnnotationLevelBar";
import AnnotationTimeline from "@/components/wrappers/Annotation/AnnotationTimeline/AnnotationTimeline";
import MusicPlayer from "@/components/wrappers/MusicPlayer/MusicPlayer";
import PureAudioPlayer from "@/components/wrappers/PureAudioPlayer/PureAudioPlayer";
import { AnnotationContext } from "@/context/AnnotationContext";
import { ArousalGraphDataPoint } from "@/models/Graph";
import { useContext, useState } from "react";

const DEFAULT_TIMESTAMP = 0 as const;

/**
 * In seconds
 */
const DEFAULT_DURATION = 1 as const;

const exportAnnotations = (
  totalTimestamps: number,
  deltaT: number,
  annotationGetter: (timestamp: number) => number | undefined,
) => {
  /**
   * Fill in the appropriate arousal values for each time point
   */
  const values: ArousalGraphDataPoint[] = [];
  for (let timestamp = 0; timestamp < totalTimestamps; timestamp += deltaT) {
    values.push({ value: annotationGetter(timestamp) || 0, time: timestamp });
  }

  /**
   * Start process of generating a download link for the exported JSON
   */
  const json = JSON.stringify(values, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "annotations.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const Annotate = () => {
  const {
    selectedTimestamps,
    deltaT,
    updateAnnotation,
    getAnnotation,
    setSelectedTimestamps,
    setAudioSrc,
    audioSrc,
    setAudioStats,
    audioStats,
  } = useContext(AnnotationContext);

  const [firstTimestamp, setFirstTimestamp] = useState<number | undefined>(
    DEFAULT_TIMESTAMP,
  );

  /**
   * Callback for when user selects a new time on the timeline, handles multi-select
   *
   * @param time the value that the user has selected, to be added to the buffer
   */
  const handleTimeClick = (time: number) => {
    if (!firstTimestamp) {
      setFirstTimestamp(time);
    } else {
      const allSelected = [];
      /**
       * This is required to handle the case where the first timestamp is
       * larger than the second one, which causes the array to not be filled in properly
       */
      const start = Math.min(time, firstTimestamp);
      const end = Math.max(time, firstTimestamp);

      /**
       * Fill in all the values between start timestamp
       *
       * For example if we already had the timestamp `1` selected we would resolve
       * the second click of a timestamp `4` with the array `[1, 2, 3, 4]`
       */
      for (let timestamp = start; timestamp <= end; timestamp += deltaT) {
        allSelected.push(timestamp);
      }

      setSelectedTimestamps?.(allSelected);
      setFirstTimestamp(undefined);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h2>Annotate Music With Temperature</h2>

      <div className="flex justify-between">
        <h3 className="text-gray-800">Annotation timeline for current song</h3>
        <Button
          disabled={!audioSrc}
          onClick={() =>
            exportAnnotations(
              Math.ceil(audioStats?.duration || DEFAULT_DURATION),
              deltaT,
              (timestamp) => getAnnotation?.(timestamp),
            )
          }
        >
          Export (.json)
        </Button>
      </div>
      <div className="overflow-x-auto">
        <div className="flex flex-col min-w-full w-fit gap-3 p-3 bg-slate-300 rounded-md">
          <AnnotationTimeline
            audioTimestamp={audioStats?.timestamp || DEFAULT_TIMESTAMP}
            selectedTimestamps={selectedTimestamps}
            deltaT={deltaT}
            length={Math.ceil(audioStats?.duration || DEFAULT_DURATION)}
            onTimeClick={(newTime) => handleTimeClick(newTime)}
            getAssociatedZone={(timeStamp) => getAnnotation?.(timeStamp) || NaN}
          />
        </div>
      </div>
      <MusicPlayer onFileChange={(newSrc) => setAudioSrc?.(newSrc)} />
      <PureAudioPlayer
        src={audioSrc || ""}
        onDurationChange={(d) => setAudioStats?.(d)}
        onTimeUpdate={(t) => setAudioStats?.(undefined, t)}
      />
      <h3>
        Pick the temperature for time{" "}
        <strong className="italic">{selectedTimestamps.join("s, ")}s</strong>
      </h3>
      <div className="bg-slate-300 p-3 rounded-md flex flex-col gap-3 ">
        <AnnotationLevelBar
          handleZoneChange={(zone) => {
            selectedTimestamps.forEach((timestamp) => {
              updateAnnotation?.(timestamp, zone);
            });
          }}
          /**
           * We assume that the selected range is uniform, only plays a role visually
           *
           * If it is not uniform then choosing a different temperature will simply
           * overwrite all values inside the range
           */
          selectedZone={getAnnotation?.(selectedTimestamps[0])}
        />
      </div>
    </div>
  );
};

export default Annotate;
