import { useEffect, useRef } from "react";

interface IPureAudioPlayer {
  /**
   * The filepath or URI to the audio file to plau
   */
  src: string;
  /**
   * Callback that will be called on a new audio file being uploaded
   *
   * @param duration how long the actual audio file is - in seconds
   */
  onDurationChange?: (duration: number) => void;
  /**
   * Callback that is called once the timestamp of the playing audio file has changed,
   * whether through manual user input or playback
   *
   * @param currentTime the new timestamp of the current playing audio file - in secojnds
   */
  onTimeUpdate?: (currentTime: number) => void;
}

/**
 * Component to allow for native callbacks regarding duration and timestamp change in an audio file
 */
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

  return <audio className="w-full" ref={audioRef} src={src} controls />;
};

export default PureAudioPlayer;
