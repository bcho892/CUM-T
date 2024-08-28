import { Button } from "@/components/ui/button";
import AnnotationLevelBar from "@/components/wrappers/Annotation/AnnotationBar/AnnotationLevelBar";
import AnnotationTimeline from "@/components/wrappers/Annotation/AnnotationTimeline/AnnotationTimeline";
import MusicPlayer from "@/components/wrappers/MusicPlayer/MusicPlayer";
import PureAudioPlayer from "@/components/wrappers/PureAudioPlayer/PureAudioPlayer";
import { AnnotationContext } from "@/context/AnnotationContext";
import { ArousalGraphDataPoint } from "@/models/Graph";
import { useContext } from "react";

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
    selectedTimestamp,
    deltaT,
    updateAnnotation,
    getAnnotation,
    setCurrentTime,
    setAudioSrc,
    audioSrc,
    setAudioStats,
    audioStats,
  } = useContext(AnnotationContext);

  return (
    <div className="flex flex-col gap-2">
      <h2>Annotate Music With Temperature</h2>

      <div className="flex justify-between">
        <h3 className="text-gray-800">Annotation timeline for current song</h3>
        <Button
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
            selectedTimestamp={selectedTimestamp}
            deltaT={deltaT}
            length={Math.ceil(audioStats?.duration || 1)}
            onTimeClick={(newTime) => setCurrentTime?.(newTime)}
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
      <h3>Pick the temperature for time {selectedTimestamp}s</h3>
      <div className="bg-slate-300 p-3 rounded-md flex flex-col gap-3">
        <AnnotationLevelBar
          handleZoneChange={(zone) =>
            updateAnnotation?.(selectedTimestamp, zone)
          }
          selectedZone={getAnnotation?.(selectedTimestamp)}
        />
      </div>
    </div>
  );
};

export default Annotate;
