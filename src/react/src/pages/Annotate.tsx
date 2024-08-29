import { Button } from "@/components/ui/button";
import AnnotationLevelBar from "@/components/wrappers/Annotation/AnnotationBar/AnnotationLevelBar";
import AnnotationTimeline from "@/components/wrappers/Annotation/AnnotationTimeline/AnnotationTimeline";
import MusicPlayer from "@/components/wrappers/MusicPlayer/MusicPlayer";
import PureAudioPlayer from "@/components/wrappers/PureAudioPlayer/PureAudioPlayer";
import { AnnotationContext } from "@/context/AnnotationContext";
import { ArousalGraphDataPoint } from "@/models/Graph";
import { useContext, useState } from "react";

const exportAnnotations = (
  totalTimestamps: number,
  deltaT: number,
  annotationGetter: (timestamp: number) => number | undefined,
) => {
  const values: ArousalGraphDataPoint[] = [];
  for (let timestamp = 0; timestamp < totalTimestamps; timestamp += deltaT) {
    values.push({ value: annotationGetter(timestamp) || 0, time: timestamp });
  }

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

  const [{ first }, setTimestamps] = useState<{ first?: number }>({ first: 0 });

  const handleTimeClick = (time: number) => {
    if (!first) {
      setTimestamps({ first: time });
    } else {
      const allSelected = [];
      const start = Math.min(time, first);
      const end = Math.max(time, first);
      for (let timestamp = start; timestamp <= end; timestamp += deltaT) {
        allSelected.push(timestamp);
      }
      setSelectedTimestamps?.(allSelected);
      setTimestamps({});
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
              Math.ceil(audioStats?.duration || 0),
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
            audioTimestamp={audioStats?.timestamp || 0}
            selectedTimestamps={selectedTimestamps}
            deltaT={deltaT}
            length={Math.ceil(audioStats?.duration || 1)}
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
      <div className="bg-slate-300 p-3 rounded-md flex flex-col gap-3">
        <AnnotationLevelBar
          handleZoneChange={(zone) => {
            selectedTimestamps.forEach((timestamp) => {
              updateAnnotation?.(timestamp, zone);
            });
          }}
          selectedZone={getAnnotation?.(selectedTimestamps[0])}
        />
      </div>
    </div>
  );
};

export default Annotate;
