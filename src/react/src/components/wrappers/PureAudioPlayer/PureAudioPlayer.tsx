import { useEffect, useRef } from "react";

interface IPureAudioPlayer {
  src: string;
  onDurationChange?: (duration: number) => void;
  onTimeUpdate?: (currentTime: number) => void;
}

const PureAudioPlayer = ({
  src,
  onDurationChange,
  onTimeUpdate,
}: IPureAudioPlayer) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audioElement = audioRef.current;

    if (audioElement) {
      const handleLoadedMetadata = () => {
        if (onDurationChange) {
          onDurationChange(audioElement.duration);
        }
      };

      const handleTimeUpdate = () => {
        if (onTimeUpdate) {
          onTimeUpdate(audioElement.currentTime);
        }
      };

      audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
      audioElement.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        audioElement.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata,
        );
        audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [onDurationChange, onTimeUpdate]);

  return <audio ref={audioRef} src={src} controls />;
};

export default PureAudioPlayer;
