import AnnotationLevelBar from "@/components/wrappers/Annotation/AnnotationBar/AnnotationLevelBar";
import AnnotationTimeline from "@/components/wrappers/Annotation/AnnotationTimeline/AnnotationTimeline";
import MusicPlayer from "@/components/wrappers/MusicPlayer/MusicPlayer";
import PureAudioPlayer from "@/components/wrappers/PureAudioPlayer/PureAudioPlayer";
import { AnnotationContext } from "@/context/AnnotationContext";
import { useContext } from "react";

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
      <AnnotationTimeline
        audioTimestamp={audioStats?.timestamp || 0}
        selectedTimestamp={selectedTimestamp}
        deltaT={deltaT}
        length={Math.ceil(audioStats?.duration || 0)}
        onTimeClick={(newTime) => setCurrentTime?.(newTime)}
        getAssociatedZone={(timeStamp) => getAnnotation?.(timeStamp) || NaN}
      />
      <MusicPlayer onFileChange={(newSrc) => setAudioSrc?.(newSrc)} />
      <PureAudioPlayer
        src={audioSrc || ""}
        onDurationChange={(d) => setAudioStats?.(d)}
        onTimeUpdate={(t) => setAudioStats?.(undefined, t)}
      />
      <AnnotationLevelBar
        handleZoneChange={(zone) => updateAnnotation?.(selectedTimestamp, zone)}
        selectedZone={getAnnotation?.(selectedTimestamp)}
      />
    </div>
  );
};

export default Annotate;
